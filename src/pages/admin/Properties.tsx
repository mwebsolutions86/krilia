import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { uploadAndCompressImage } from '@/services/storage';
import { createApartment, updateApartment, getActiveApartments, type Apartment } from '@/services/apartment';
// NOUVEAU : Import de l'icône Star
import { Loader2, UploadCloud, Image as ImageIcon, Edit, Plus, X, Star } from 'lucide-react';
import { toast } from 'sonner';

export default function Properties() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [amenitiesStr, setAmenitiesStr] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    async function loadInitialData() {
      const data = await getActiveApartments();
      setApartments(data);
    }
    loadInitialData();
  }, []);

  const handleEdit = (apt: Apartment) => {
    setEditingId(apt.id);
    setTitle(apt.title);
    setLocation(apt.location);
    setPrice(apt.base_price_per_night.toString());
    setDescription(apt.description);
    setAmenitiesStr(apt.amenities.join(', '));
    setExistingImages(apt.images || []);
    setSelectedFiles([]);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleResetForm = () => {
    setEditingId(null);
    setTitle(''); setLocation(''); setPrice(''); setDescription(''); setAmenitiesStr('');
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

  // NOUVEAU : Fonction pour définir l'image principale
  const handleSetMainImage = (indexToMain: number) => {
    if (indexToMain === 0) return; // Déjà principale
    setExistingImages(prev => {
      const newArray = [...prev];
      const [itemToMove] = newArray.splice(indexToMain, 1); // Retire l'image de sa position
      newArray.unshift(itemToMove); // La place tout au début (index 0)
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
    const apartmentData = {
      title,
      location,
      description,
      base_price_per_night: Number(price),
      amenities: amenitiesArray,
      images: imageUrls,
      is_active: isActive
    };

    let result;
    if (editingId) {
      result = await updateApartment(editingId, apartmentData);
    } else {
      result = await createApartment(apartmentData);
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
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-serif tracking-tight">Gestion des Biens</h1>
        <p className="text-muted-foreground mt-1">Gérez votre catalogue d'appartements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {apartments.map((apt) => (
          <Card key={apt.id} className="bg-card border-border/50 overflow-hidden">
            <div className="h-32 bg-secondary/30 relative">
              {apt.images.length > 0 ? (
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

        <Card className="bg-card border-border/50 shadow-sm">
          <CardContent className="space-y-6 pt-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Titre de l'annonce</Label>
                <Input id="title" required value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Localisation</Label>
                <Input id="location" required value={location} onChange={e => setLocation(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Prix par nuit (Dhs)</Label>
                <Input id="price" type="number" min="0" required value={price} onChange={e => setPrice(e.target.value)} />
              </div>
              <div className="space-y-2 flex flex-col justify-center pt-6">
                <div className="flex items-center space-x-2">
                  <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
                  <Label htmlFor="active">Annonce visible</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" required rows={4} value={description} onChange={e => setDescription(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amenities">Équipements (séparés par des virgules)</Label>
              <Input id="amenities" value={amenitiesStr} onChange={e => setAmenitiesStr(e.target.value)} />
            </div>

            <div className="pt-6 border-t border-border/50 space-y-4">
              <Label>Galerie Photos</Label>
              
              {existingImages.length > 0 && (
                <div className="flex flex-wrap gap-4 mb-4">
                  {existingImages.map((img, i) => (
                    <div key={i} className={`relative w-28 h-28 rounded-md overflow-hidden border-2 group ${i === 0 ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}>
                      <img src={img} className="w-full h-full object-cover" alt="" />
                      
                      {/* Badge PRINCIPALE pour la 1ère image */}
                      {i === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-[10px] text-center text-primary-foreground py-1 font-bold tracking-wider">
                          PRINCIPALE
                        </div>
                      )}

                      {/* Boutons d'action au survol */}
                      <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          type="button" 
                          onClick={() => handleRemoveExistingImage(i)}
                          className="bg-background/90 text-foreground rounded-full p-1.5 hover:bg-destructive hover:text-destructive-foreground shadow-sm"
                          title="Supprimer cette photo"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        
                        {i !== 0 && (
                          <button 
                            type="button" 
                            onClick={() => handleSetMainImage(i)}
                            className="bg-background/90 text-foreground rounded-full p-1.5 hover:bg-primary hover:text-primary-foreground shadow-sm"
                            title="Mettre en photo principale"
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="w-full text-xs text-muted-foreground mt-1">({existingImages.length} images en ligne)</div>
                </div>
              )}

              <div className="border-2 border-dashed border-border/50 rounded-xl p-8 text-center hover:bg-secondary/20 transition-colors">
                <Input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" id="file-upload" />
                <Label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-3">
                  <UploadCloud className="w-10 h-10 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground font-medium">Ajouter de nouvelles photos (Optionnel)</span>
                </Label>
              </div>
              
              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-3">
                  <div className="text-sm text-primary flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> {selectedFiles.length} nouvelle(s) photo(s) prête(s)
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedFiles.map((file, i) => (
                      <div key={i} className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-md text-xs border border-border/50">
                        <span className="truncate max-w-[120px]">{file.name}</span>
                        <button type="button" onClick={() => handleRemoveSelectedFile(i)} className="text-muted-foreground hover:text-destructive">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full py-6 text-lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {uploadProgress}</>
              ) : (
                editingId ? "Enregistrer les modifications" : "Publier l'appartement"
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}