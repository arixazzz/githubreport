import Link from 'next/link'
import { Button } from "@/components/ui/button";

export default function Home(){
  return (
  <div>
     <Link className='bg-black p-2 rounded text-white' href="/blog">Link</Link>
  </div>
  );
}