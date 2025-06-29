import Image from 'next/image';

export function StudioLogo() {
    return (
        <Image
            src="/logos/hexoprint-sans-text-no-bg-250x250.png"
            alt="Hexo'print"
            width={25}
            height={25}
            className="object-contain"
            priority
        />
    );
}
