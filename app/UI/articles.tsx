"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// UI Components
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import AddArticles from "./addArticles";

type Article = {
    id: string | number;
    title: string;
    excerpt?: string;
    content?: string;
    image?: string;
    createdAt?: string;
    updatedAt?: string;
};

export default function Articles() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState<Article | null>(null);

    useEffect(() => {
        let abort = false;

        const fetchArticles = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${API_URL}/api/articles`, {
                    headers: { "Content-Type": "application/json" },
                    cache: "no-store",
                });
                if (!res.ok) throw new Error(`Erreur ${res.status}`);
                const json = await res.json();
                if (!abort) {
                    const list = Array.isArray(json.data)
                        ? json.data
                        : Array.isArray(json)
                            ? json
                            : [];
                    setArticles(list);
                }
            } catch (e: any) {
                if (!abort) setError(e.message || "Erreur inattendue");
            } finally {
                if (!abort) setLoading(false);
            }
        };

        fetchArticles();
        return () => {
            abort = true;
        };
    }, [API_URL]);

    const openDialog = (article: Article) => {
        setCurrent(article);
        setOpen(true);
    };

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="h-7 w-40 bg-slate-400 rounded-xl  animate-pulse" />
                    <div className="h-9 w-28 bg-slate-400 rounde-2xl animate-pulse" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-10">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <div
                            key={i}
                            className="p-2 flex flex-col border rounded-2xl w-full h-44 bg-slate-300 animate-pulse"
                        >

                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (error)
        return (
            <div className="p-6">
                <p className="text-red-500 mb-4">
                    Impossible de charger les articles: {error}
                </p>
                <Button onClick={() => location.reload()}>Réessayer</Button>
            </div>
        );

    return (
        <div className="space-y-6 p-6 min-h-[100vh]">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Articles</h1>

                <div className="flex gap-2">
                    <AddArticles />
                    <Button onClick={() => window.location.reload()}>Rafraîchir</Button>
                </div>
            </header>

            {articles.length === 0 && <p>Aucun article disponible.</p>}


            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-10">
                {articles.map((a) => (
                    <div key={a.id} className="p-2 flex flex-col border rounded-2xl">
                        {a.image && (
                            <Image
                                src={a.image}
                                alt={a.title}
                                width={150}
                                height={150}
                                className="mb-3 h-40 w-full object-cover rounded"
                                loading="lazy"
                            />
                        )}
                        <h2 className="font-medium text-lg line-clamp-2 mb-2">{a.title}</h2>
                        {a.excerpt && (
                            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                {a.excerpt}
                            </p>
                        )}
                        <div className="mt-auto">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => openDialog(a)}
                            >
                                Lire
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-[95%] p-2 sm:p-4 overflow-x-hidden">
                    {current && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{current.title}</DialogTitle>
                                {current.excerpt && (
                                    <DialogDescription> Description de l'article</DialogDescription>
                                )}
                            </DialogHeader>
                            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 overflow-x-hidden">
                                {current.image && (
                                    <Image
                                        src={current.image}
                                        alt={current.title}
                                        width={150}
                                        height={150}
                                        className="w-full h-auto rounded"
                                        priority={false}
                                    />
                                )}
                                <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
                                    {current.content
                                        ? current.content
                                        : "Aucun contenu disponible."}
                                </div>
                                
                                <div className="flex justify-end">
                                    <Button
                                        variant="secondary"
                                        onClick={() => setOpen(false)}
                                        autoFocus
                                    >
                                        Fermer
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
