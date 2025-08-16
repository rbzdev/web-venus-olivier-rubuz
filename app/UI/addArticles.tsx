"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ArticleFormData {
    title: string;
    content: string;
    imageUrl: string;
}

export default function AddArticles() {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<ArticleFormData>({
        title: "",
        content: "",
        imageUrl: "",
    });

    // API URL
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const onChange =
        (field: keyof ArticleFormData) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setData((d) => ({ ...d, [field]: e.target.value }));
            };

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // DEBUG
        // console.log(data);
        // Soumettre les données au backend (fetch / action server)


        const response = await fetch(`${API_URL}/api/articles/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            toast.success("Article ajouté avec succès !");
        } else {
            toast.error("Erreur lors de l'ajout de l'article.");
        }

        // Rafraîchir la page pour fetch les nouveaux articles
        window.location.reload();
    };

    const isDisabled =
        !data.title.trim() || !data.content.trim() || !data.imageUrl.trim();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Ajouter un article</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ajouter un nouvel article</DialogTitle>
                    <DialogDescription>
                        Remplissez les informations ci-dessous pour ajouter un nouvel article.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="title">
                            Titre
                        </label>
                        <Input
                            id="title"
                            placeholder="Titre de l'article"
                            value={data.title}
                            onChange={onChange("title")}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="imageUrl">
                            Lien de l'image
                        </label>
                        <Input
                            id="imageUrl"
                            type="url"
                            placeholder="https://exemple.com/image.jpg"
                            value={data.imageUrl}
                            onChange={onChange("imageUrl")}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="content">
                            Contenu
                        </label>
                        <Textarea
                            id="content"
                            placeholder="Contenu de l'article"
                            value={data.content}
                            onChange={onChange("content")}
                            rows={6}
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isDisabled}>
                            Ajouter
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
