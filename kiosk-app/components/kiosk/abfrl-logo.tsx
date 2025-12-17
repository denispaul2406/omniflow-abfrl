import Image from "next/image"

interface ABFRLLogoProps {
  size?: number
}

export function ABFRLLogo({ size = 80 }: ABFRLLogoProps) {
  return (
    <div className="flex items-center">
      <Image
        src="/ABFRL-Logo.png"
        alt="ABFRL Logo"
        width={size}
        height={size * 0.5}
        className="object-contain"
        priority
      />
    </div>
  )
}
