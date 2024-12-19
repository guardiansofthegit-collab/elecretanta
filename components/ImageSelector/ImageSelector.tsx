"use client";

import Image from "next/image";
import { Card } from "@/components/Card/card";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/RadioGroup/radio-group";
import { Label } from "@/components/Label/label";

interface ImageSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function ImageSelector({ value, onChange }: ImageSelectorProps) {
  const images = [
    {
      id: "image1",
      src: "/placeholder.svg?height=120&width=120",
      alt: "Image 1",
    },
    {
      id: "image2",
      src: "/placeholder.svg?height=120&width=120",
      alt: "Image 2",
    },
    {
      id: "image3",
      src: "/placeholder.svg?height=120&width=120",
      alt: "Image 3",
    },
  ];

  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 m-5"
    >
      {images.map((image) => (
        <div key={image.id}>
          <RadioGroupItem
            value={image.id}
            id={image.id}
            className="peer sr-only"
          />
          <Label htmlFor={image.id} className="cursor-pointer">
            <Card className="overflow-hidden transition-all hover:ring-2 hover:ring-primary peer-aria-checked:ring-2 peer-aria-checked:ring-primary">
              <div className="relative aspect-video">
                <Image
                  src={image.src}
                  alt={image.alt}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4">
                <p className="text-center font-medium">{image.alt}</p>
              </div>
            </Card>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
