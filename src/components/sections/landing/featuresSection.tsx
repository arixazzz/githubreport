import { CheckCircle, Code, Layers, Zap } from "lucide-react";

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="w-full py-12 md:py-24 lg:py-32 bg-muted/50"
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
              Fitur Unggulan
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Semua yang Anda Butuhkan untuk Proyek Frontend
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Template kami dilengkapi dengan semua fitur yang Anda butuhkan
              untuk membangun aplikasi web modern dengan cepat.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-4 shadow-sm">
            <div className="rounded-full bg-primary/10 p-2">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Performa Tinggi</h3>
            <p className="text-center text-sm text-muted-foreground">
              Dioptimalkan untuk kecepatan dan pengalaman pengguna yang mulus
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-4 shadow-sm">
            <div className="rounded-full bg-primary/10 p-2">
              <Layers className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Komponen Modern</h3>
            <p className="text-center text-sm text-muted-foreground">
              Komponen UI yang elegan dan dapat digunakan kembali
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-4 shadow-sm">
            <div className="rounded-full bg-primary/10 p-2">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">TypeScript</h3>
            <p className="text-center text-sm text-muted-foreground">
              Kode yang aman dengan dukungan TypeScript penuh
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-4 shadow-sm">
            <div className="rounded-full bg-primary/10 p-2">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Praktik Terbaik</h3>
            <p className="text-center text-sm text-muted-foreground">
              Mengikuti praktik terbaik dan standar industri
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
