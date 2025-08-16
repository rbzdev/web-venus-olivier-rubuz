import Image from "next/image";

// Les composant UI
import Articles from "./UI/articles";


export default function Home() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  return (
    <div className="min-h-screen">
      <Articles />
    </div>
  );
}
