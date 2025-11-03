import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HeroSection() {
  return (
    <section>
      <Card className="gap-4">
        <CardHeader>
          <CardTitle className="text-2xl">💰</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <CardTitle className="text-lg">Najveća ušteda</CardTitle>
          <CardDescription className="text-gray-600 text-pretty">
            Usporedi cijene najvećih trgovina u Hrvatskoj
          </CardDescription>
        </CardContent>
      </Card>

      <Card className="gap-4">
        <CardHeader>
          <CardTitle className="text-2xl">📋</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <CardTitle className="text-lg">Pametni popisi</CardTitle>
          <CardDescription className="text-gray-600 text-pretty">
            Kreiraj i dijeli popise za kupnju s obitelji
          </CardDescription>
        </CardContent>
      </Card>

      <Card className="gap-4">
        <CardHeader>
          <CardTitle className="text-2xl">📈</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <CardTitle className="text-lg">Povijest cijena</CardTitle>
          <CardDescription className="text-gray-600 text-pretty">
            Prati povijest cijena i dobivaj obavijesti
          </CardDescription>
        </CardContent>
      </Card>
    </section>
  );
}
