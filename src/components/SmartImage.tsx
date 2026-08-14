import Image, { type ImageProps } from 'next/image';

type Props = Omit<ImageProps, 'src'> & { src: string };

// Wrapper that passes unoptimized=true for data URLs so Next.js Image
// doesn't try to run them through the optimization pipeline.
export default function SmartImage({ src, ...props }: Props) {
  const isData = src.startsWith('data:') || src.startsWith('blob:');
  return <Image src={src} {...props} unoptimized={isData || Boolean(props.unoptimized)} />;
}
