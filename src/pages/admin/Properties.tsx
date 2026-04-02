import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { uploadAndCompressImage } from '@/services/storage';
import { createApartment, updateApartment, getActiveApartments, type Apartment, type CreateApartmentDTO } from '@/services/apartment';
import { translatePropertySecurely } from '@/services/ai';
import { 
  Loader2, UploadCloud, Edit, Plus, X, Star, Sparkles 
} from 'lucide-react';
import { toast } from 'sonner';

export default function Properties() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [owners, setOwners] = useState<{ id: string; full_name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [amenitiesStr, setAmenitiesStr] = useState('');
  
  const [titleEn, setTitleEn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [locationEn, setLocationEn] = useState('');
  const [locationAr, setLocationAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [amenitiesEnStr, setAmenitiesEnStr] = useState('');
  const [amenitiesArStr, setAmenitiesArStr] = useState('');

  const [price, setPrice] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [selectedOwnerId, setSelectedOwnerId] = useState('');
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    async function loadInitialData() {
      const data = await getActiveApartments();
      setApartments(data);

      const { data: ownersData } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'owner');
      
      if (ownersData) {
        setOwners(ownersData);
      }
    }
    loadInitialData();
  }, []);

  const handleAutoTranslate = async () => {
    if (!title || !description || !location || !amenitiesStr) {
      toast.error("Remplissez le titre, la description, la localisation ET les équipements (Fr) d'abord.");
      return;
    }

    setIsTranslating(true);
    try {
      const translations = await translatePropertySecurely({ title, description, location, amenities: amenitiesStr });
      
      setTitleEn(translations.title_en);
      setTitleAr(translations.title_ar);
      setLocationEn(translations.location_en);
      setLocationAr(translations.location_ar);
      setDescriptionEn(translations.description_en);
      setDescriptionAr(translations.description_ar);
      setAmenitiesEnStr(translations.amenities_en);
      setAmenitiesArStr(translations.amenities_ar);
      
      toast.success("Traductions générées avec succès !");
    } catch {
      toast.error("Erreur lors de la traduction IA.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleEdit = (apt: Apartment) => {
    setEditingId(apt.id);
    setTitle(apt.title);
    setLocation(apt.location);
    setDescription(apt.description);
    setAmenitiesStr(apt.amenities && apt.amenities.length > 0 ? apt.amenities.join(', ') : '');
    
    setTitleEn(apt.title_en || '');
    setTitleAr(apt.title_ar || '');
    setLocationEn(apt.location_en || '');
    setLocationAr(apt.location_ar || '');
    setDescriptionEn(apt.description_en || '');
    setDescriptionAr(apt.description_ar || '');
    
    setAmenitiesEnStr(apt.amenities_en && apt.amenities_en.length > 0 ? apt.amenities_en.join(', ') : '');
    setAmenitiesArStr(apt.amenities_ar && apt.amenities_ar.length > 0 ? apt.amenities_ar.join(', ') : '');

    setPrice(apt.base_price_per_night.toString());
    setSelectedOwnerId(apt.owner_id || '');
    setExistingImages(apt.images || []);
    setSelectedFiles([]);
    window.scrollTo({ top: document.querySelector('form')?.offsetTop || 0, behavior: 'smooth' });
  };

  const handleResetForm = () => {
    setEditingId(null);
    setTitle(''); setLocation(''); setDescription(''); setAmenitiesStr('');
    setTitleEn(''); setTitleAr(''); setLocationEn(''); setLocationAr(''); setDescriptionEn(''); setDescriptionAr('');
    setAmenitiesEnStr(''); setAmenitiesArStr('');
    setPrice(''); 
    setSelectedOwnerId('');
    setExistingImages([]); setSelectedFiles([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setSelectedFiles(Array.from(e.target.files));
  };

  const handleRemoveExistingImage = (indexToRemove: number) => {
    setExistingImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleRemoveSelectedFile = (indexToRemove: number) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSetMainImage = (indexToMain: number) => {
    if (indexToMain === 0) return;
    setExistingImages(prev => {
      const newArray = [...prev];
      const [itemToMove] = newArray.splice(indexToMain, 1);
      newArray.unshift(itemToMove);
      return newArray;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const imageUrls: string[] = [...existingImages];

    if (selectedFiles.length > 0) {
      for (let i = 0; i < selectedFiles.length; i++) {
        setUploadProgress(`Compression... (${i + 1}/${selectedFiles.length})`);
        const url = await uploadAndCompressImage(selectedFiles[i]);
        if (url) imageUrls.push(url);
      }
    }

    setUploadProgress("Sauvegarde du bien...");

    const amenitiesArray = amenitiesStr.split(',').map(item => item.trim()).filter(Boolean);
    const amenitiesEnArray = amenitiesEnStr.split(',').map(item => item.trim()).filter(Boolean);
    const amenitiesArArray = amenitiesArStr.split(',').map(item => item.trim()).filter(Boolean);
    
    // Correction finale des types : On force undefined à la place de string vide
    const apartmentData = {
      title,
      title_en: titleEn,
      title_ar: titleAr,
      location,
      location_en: locationEn,
      location_ar: locationAr,
      description,
      description_en: descriptionEn,
      description_ar: descriptionAr,
      base_price_per_night: Number(price),
      amenities: amenitiesArray,
      amenities_en: amenitiesEnArray,
      amenities_ar: amenitiesArArray,
      images: imageUrls,
      is_active: isActive,
      owner_id: selectedOwnerId ? selectedOwnerId : undefined 
    };

    let result;
    if (editingId) {
      result = await updateApartment(editingId, apartmentData as Partial<Apartment>);
    } else {
      result = await createApartment(apartmentData as unknown as CreateApartmentDTO);
    }

    setIsSubmitting(false);
    setUploadProgress('');

    if (result.success) {
      toast.success(editingId ? "Bien modifié avec succès !" : "Bien ajouté avec succès !");
      handleResetForm();
      const updatedData = await getActiveApartments();
      setApartments(updatedData);
    } else {
      toast.error("Erreur lors de la sauvegarde.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto pb-20">
      <div>
        <h1 className="text-3xl font-serif tracking-tight">Gestion des Biens</h1>
        <p className="text-muted-foreground mt-1">Gérez votre catalogue d'appartements multilingue.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {apartments.map((apt) => (
          <Card key={apt.id} className="bg-card border-border/50 overflow-hidden">
            <div className="h-32 bg-secondary/30 relative">
              {apt.images && apt.images.length > 0 ? (
                <img src={apt.images[0]} alt={apt.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Sans photo</div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-serif font-medium truncate">{apt.title}</h3>
              <p className="text-sm text-muted-foreground">{apt.base_price_per_night} Dhs / nuit</p>
              <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => handleEdit(apt)}>
                <Edit className="w-4 h-4 mr-2" /> Modifier
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-12 pt-8 border-t border-border/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif">
            {editingId ? 'Modifier le bien' : 'Ajouter un nouveau bien'}
          </h2>
          {editingId && (
            <Button type="button" variant="ghost" onClick={handleResetForm}>
              <Plus className="w-4 h-4 mr-2" /> Basculer en mode Création
            </Button>
          )}
        </div>

        <div className="space-y-8">
          <Card className="bg-secondary/10 border-primary/20 shadow-sm border-2">
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2"><span className="text-xl">🇫🇷</span> Contenu Source (Français)</h3>
                <Button 
                  type="button" 
                  onClick={handleAutoTranslate} 
                  disabled={isTranslating || !title || !description || !amenitiesStr}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg"
                >
                  {isTranslating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                  Traduire avec l'IA
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre de l'annonce</Label>
                  <Input id="title" required value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Superbe Appartement Marina..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Localisation</Label>
                  <Input id="location" required value={location} onChange={e => setLocation(e.target.value)} placeholder="Ex: Quartier Salam, Agadir" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description complète</Label>
                <Textarea id="description" required rows={4} value={description} onChange={e => setDescription(e.target.value)} />
              </div>

              <div className="space-y-2 pt-4 border-t border-primary/10">
                <Label htmlFor="amenities">Équipements en Français (séparés par des virgules)</Label>
                <Input id="amenities" required value={amenitiesStr} onChange={e => setAmenitiesStr(e.target.value)} placeholder="Wifi, Piscine, Parking..." />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border/50">
              <CardContent className="space-y-4 pt-6">
                <h3 className="font-bold flex items-center gap-2"><span className="text-xl">🇬🇧</span> English</h3>
                <div className="space-y-2">
                  <Label className="text-xs uppercase text-muted-foreground">Title</Label>
                  <Input value={titleEn} onChange={e => setTitleEn(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase text-muted-foreground">Location</Label>
                  <Input value={locationEn} onChange={e => setLocationEn(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase text-muted-foreground">Description</Label>
                  <Textarea rows={4} value={descriptionEn} onChange={e => setDescriptionEn(e.target.value)} />
                </div>
                <div className="space-y-2 pt-2">
                  <Label className="text-xs uppercase text-muted-foreground">Amenities (comma separated)</Label>
                  <Input value={amenitiesEnStr} onChange={e => setAmenitiesEnStr(e.target.value)} placeholder="Wifi, Pool, Parking..." />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="space-y-4 pt-6" dir="rtl">
                <h3 className="font-bold flex items-center gap-2 justify-end">العربية <span className="text-xl">🇲🇦</span></h3>
                <div className="space-y-2">
                  <Label className="text-xs uppercase text-muted-foreground">العنوان</Label>
                  <Input value={titleAr} onChange={e => setTitleAr(e.target.value)} className="text-right" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase text-muted-foreground">الموقع</Label>
                  <Input value={locationAr} onChange={e => setLocationAr(e.target.value)} className="text-right" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase text-muted-foreground">الوصف</Label>
                  <Textarea rows={4} value={descriptionAr} onChange={e => setDescriptionAr(e.target.value)} className="text-right" />
                </div>
                <div className="space-y-2 pt-2">
                  <Label className="text-xs uppercase text-muted-foreground">المرافق (مفصولة بفواصل)</Label>
                  <Input value={amenitiesArStr} onChange={e => setAmenitiesArStr(e.target.value)} className="text-right" placeholder="واي فاي، مسبح، موقف سيارات..." />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border/50 shadow-sm">
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Prix par nuit (Dhs)</Label>
                  <Input id="price" type="number" min="0" required value={price} onChange={e => setPrice(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="owner">Propriétaire du bien</Label>
                  <select 
                    id="owner"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={selectedOwnerId}
                    onChange={(e) => setSelectedOwnerId(e.target.value)}
                  >
                    <option value="">-- Aucun (Krilia Agency) --</option>
                    {owners.map(o => (
                      <option key={o.id} value={o.id}>{o.full_name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 flex flex-col justify-center md:pt-6">
                  <div className="flex items-center space-x-2">
                    <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
                    <Label htmlFor="active">Annonce visible</Label>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border/50 space-y-4">
                <Label>Galerie Photos</Label>
                {existingImages.length > 0 && (
                  <div className="flex flex-wrap gap-4 mb-4">
                    {existingImages.map((img, i) => (
                      <div key={i} className={`relative w-28 h-28 rounded-md overflow-hidden border-2 group ${i === 0 ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}>
                        <img src={img} className="w-full h-full object-cover" alt="" />
                        {i === 0 && <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-[10px] text-center text-primary-foreground py-1 font-bold tracking-wider">PRINCIPALE</div>}
                        <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button type="button" onClick={() => handleRemoveExistingImage(i)} className="bg-background/90 text-foreground rounded-full p-1.5 hover:bg-destructive hover:text-destructive-foreground shadow-sm"><X className="w-3.5 h-3.5" /></button>
                          {i !== 0 && <button type="button" onClick={() => handleSetMainImage(i)} className="bg-background/90 text-foreground rounded-full p-1.5 hover:bg-primary hover:text-primary-foreground shadow-sm"><Star className="w-3.5 h-3.5" /></button>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="border-2 border-dashed border-border/50 rounded-xl p-8 text-center hover:bg-secondary/20 transition-colors">
                  <Input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" id="file-upload" />
                  <Label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-3">
                    <UploadCloud className="w-10 h-10 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground font-medium">Ajouter de nouvelles photos</span>
                  </Label>
                </div>
                {selectedFiles.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedFiles.map((file, i) => (
                      <div key={i} className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-md text-xs border border-border/50">
                        <span className="truncate max-w-[120px]">{file.name}</span>
                        <button type="button" onClick={() => handleRemoveSelectedFile(i)} className="text-muted-foreground hover:text-destructive"><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full py-6 text-lg" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {uploadProgress}</> : (editingId ? "Enregistrer les modifications" : "Publier l'appartement")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}