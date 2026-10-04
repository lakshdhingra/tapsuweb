import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function StyleguidePage() {
  return (
    <div className="py-24 space-y-32">
      <Container>
        <div className="space-y-4 mb-16 border-b pb-8">
          <h1 className="text-4xl font-heading font-bold text-primary">TASPU Design System</h1>
          <p className="text-muted-foreground">Styleguide and Component Inventory</p>
        </div>

        {/* Typography */}
        <section className="space-y-8">
          <SectionHeading eyebrow="Foundations" heading="Typography" />
          <div className="grid gap-8">
            <div>
              <div className="text-sm text-muted-foreground mb-2">Display (Playfair Display)</div>
              <h1 className="font-heading text-6xl font-bold">Stronger together.</h1>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">Heading (Playfair Display)</div>
              <h2 className="font-heading text-4xl font-bold">Building a connected community.</h2>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">Body (Inter)</div>
              <p className="text-lg text-foreground max-w-2xl leading-relaxed">
                TASPU brings together authorized service centre proprietors across Telangana to ensure
                stronger representation, networking, and support. Because a stronger community creates a stronger voice.
              </p>
            </div>
          </div>
        </section>
      </Container>

      {/* Colors */}
      <Container>
        <section className="space-y-8">
          <SectionHeading eyebrow="Foundations" heading="Colors" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <ColorSwatch name="Deep Burgundy" className="bg-[#6B1724] text-white" />
            <ColorSwatch name="Primary Maroon" className="bg-[#8B1E2D] text-white" />
            <ColorSwatch name="Dark Burgundy" className="bg-[#4E101A] text-white" />
            <ColorSwatch name="Muted Gold" className="bg-[#C9A227] text-white" />
            <ColorSwatch name="Warm Gold" className="bg-[#D4AF37] text-white" />
            <ColorSwatch name="Ivory" className="bg-[#FAF8F3] text-black border" />
            <ColorSwatch name="Charcoal" className="bg-[#171717] text-white" />
            <ColorSwatch name="Gray Dark" className="bg-[#303030] text-white" />
            <ColorSwatch name="Gray Medium" className="bg-[#6B6B6B] text-white" />
            <ColorSwatch name="Gray Light" className="bg-[#E9E6E0] text-black" />
          </div>
        </section>
      </Container>

      {/* Components */}
      <Container>
        <section className="space-y-12">
          <SectionHeading eyebrow="UI Library" heading="Components" />
          
          <div className="space-y-12">
            {/* Buttons */}
            <div>
              <h3 className="text-xl font-bold mb-6 font-heading">Buttons</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Button>Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="link">Link Button</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>

            {/* Badges */}
            <div>
              <h3 className="text-xl font-bold mb-6 font-heading">Badges</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </div>

            {/* Cards */}
            <div>
              <h3 className="text-xl font-bold mb-6 font-heading">Cards</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Card Content goes here. Keep it simple and clean.</p>
                  </CardContent>
                  <CardFooter>
                    <Button>Action</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>

            {/* Forms */}
            <div className="max-w-md">
              <h3 className="text-xl font-bold mb-6 font-heading">Form Inputs</h3>
              <div className="space-y-4">
                <Input placeholder="Standard Input" />
                <Input placeholder="Disabled Input" disabled />
                <Textarea placeholder="Textarea input..." />
              </div>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}

function ColorSwatch({ name, className }: { name: string; className: string }) {
  return (
    <div className="space-y-2">
      <div className={`h-24 w-full rounded-md shadow-sm ${className}`} />
      <div className="text-sm font-medium">{name}</div>
    </div>
  );
}
