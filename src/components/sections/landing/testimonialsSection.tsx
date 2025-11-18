import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
              Testimoni
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Apa Kata Pengguna Kami
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Lihat bagaimana NextCore membantu pengembang membangun aplikasi
              web modern dengan cepat.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage
                    alt="Avatar"
                    src="/placeholder.svg?height=40&width=40"
                  />
                  <AvatarFallback>JP</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold">Joko Purnomo</h3>
                  <p className="text-sm text-muted-foreground">
                    Frontend Developer
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                &quot;Template ini sangat membantu saya membangun aplikasi
                dengan cepat. Komponen UI-nya sangat elegan dan mudah
                digunakan.&quot;
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage
                    alt="Avatar"
                    src="/placeholder.svg?height=40&width=40"
                  />
                  <AvatarFallback>SW</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold">Siti Wulandari</h3>
                  <p className="text-sm text-muted-foreground">
                    UI/UX Designer
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                &quot;Desain yang modern dan responsif membuat pekerjaan saya
                sebagai designer menjadi lebih mudah. Sangat
                direkomendasikan!&quot;
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage
                    alt="Avatar"
                    src="/placeholder.svg?height=40&width=40"
                  />
                  <AvatarFallback>BS</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold">Budi Santoso</h3>
                  <p className="text-sm text-muted-foreground">CTO</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                &quot;NextCore membantu tim kami menghemat waktu pengembangan
                hingga 50%. Kualitas kode dan performa aplikasi sangat
                baik.&quot;
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
