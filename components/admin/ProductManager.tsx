'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Pencil, Trash2, Plus, Image as ImageIcon, Loader2 } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    category?: string;
}

export default function ProductManager() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'products'));
            const productsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Product[];
            setProducts(productsData);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setName('');
        setPrice('');
        setDescription('');
        setImageFile(null);
        setImageUrl('');
        setCurrentProduct(null);
    };

    const openAddModal = () => {
        resetForm();
        setIsDialogOpen(true);
    };

    const openEditModal = (product: Product) => {
        setName(product.name);
        setPrice(product.price.toString());
        setDescription(product.description || '');
        setImageUrl(product.imageUrl);
        setCurrentProduct(product);
        setIsDialogOpen(true);
    };

    const uploadToCloudinary = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'products');

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Upload failed');
        }

        return data.url;
    };

    const handleSave = async () => {
        if (!name || !price) {
            alert("Please fill in Name and Price");
            return;
        }

        setUploading(true);
        try {
            let finalImageUrl = imageUrl;

            if (imageFile) {
                console.log("Uploading product image to Cloudinary...");
                finalImageUrl = await uploadToCloudinary(imageFile);
                console.log("Product image uploaded:", finalImageUrl);
            }

            const productData = {
                name,
                price: Number(price),
                description,
                imageUrl: finalImageUrl,
                updatedAt: Timestamp.now()
            };

            if (currentProduct) {
                await updateDoc(doc(db, 'products', currentProduct.id), productData);
            } else {
                await addDoc(collection(db, 'products'), {
                    ...productData,
                    createdAt: Timestamp.now()
                });
            }

            setIsDialogOpen(false);
            fetchProducts();
            resetForm();
            alert("Product saved successfully!");
        } catch (error: any) {
            console.error("Error saving product:", error);
            alert("Failed to save product: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            await deleteDoc(doc(db, 'products', id));
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Products</h2>
                <Button onClick={openAddModal}>
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-700 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-white">{currentProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            {currentProduct ? 'Make changes to your product here.' : 'Add details for the new product.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right text-white">Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="col-span-3 bg-slate-800 border-slate-600 text-white"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right text-white">Price</Label>
                            <Input
                                id="price"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="col-span-3 bg-slate-800 border-slate-600 text-white"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right text-white">Desc</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="col-span-3 bg-slate-800 border-slate-600 text-white"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right text-white">Image</Label>
                            <div className="col-span-3 space-y-2">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            setImageFile(e.target.files[0]);
                                        }
                                    }}
                                    className="bg-slate-800 border-slate-600 text-white"
                                />
                                {imageUrl && !imageFile && (
                                    <div className="relative h-20 w-20 rounded border border-slate-600 overflow-hidden">
                                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSave} disabled={uploading}>
                            {uploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                'Save changes'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {loading ? (
                <div className="text-white">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <Card key={product.id} className="overflow-hidden bg-slate-900 border-slate-700">
                            <div className="relative h-48 w-full bg-slate-800">
                                {product.imageUrl ? (
                                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-400">
                                        <ImageIcon className="h-10 w-10" />
                                    </div>
                                )}
                            </div>
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-semibold text-lg text-white">{product.name}</h3>
                                        <p className="text-primary font-bold">Rs. {product.price}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                                    {product.description}
                                </p>
                                <div className="flex justify-end gap-2">
                                    <Button variant="secondary" size="sm" onClick={() => openEditModal(product)} className="text-black hover:bg-slate-700 hover:text-white">
                                        <Pencil className="h-4 w-4 mr-1" /> Edit
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
                                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {products.length === 0 && (
                        <p className="text-slate-400 col-span-full text-center py-8">
                            No products found. Add your first product!
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
