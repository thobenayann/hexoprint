'use client';

import { ScrollIndicator } from '@/components/ui/scroll-indicator';
import { useAspect, useTexture } from '@react-three/drei';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Mesh } from 'three';
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode.js';
import * as THREE from 'three/webgpu';

import {
    abs,
    add,
    blendScreen,
    float,
    mix,
    mod,
    mx_cell_noise_float,
    oneMinus,
    pass,
    smoothstep,
    texture,
    uniform,
    uv,
    vec2,
    vec3,
} from 'three/tsl';

const TEXTUREMAP = { src: 'https://i.postimg.cc/XYwvXN8D/img-4.png' };
const DEPTHMAP = { src: 'https://i.postimg.cc/2SHKQh2q/raw-4.webp' };

extend(THREE as any);

// Post Processing component
const PostProcessing = ({
    strength = 1,
    threshold = 1,
    fullScreenEffect = true,
}: {
    strength?: number;
    threshold?: number;
    fullScreenEffect?: boolean;
}) => {
    const { gl, scene, camera } = useThree();
    const progressRef = useRef({ value: 0 });

    const render = useMemo(() => {
        const postProcessing = new THREE.PostProcessing(gl as any);
        const scenePass = pass(scene, camera);
        const scenePassColor = scenePass.getTextureNode('output');
        const bloomPass = bloom(scenePassColor, strength, 0.5, threshold);

        // Create the scanning effect uniform
        const uScanProgress = uniform(0);
        progressRef.current = uScanProgress;

        // Create a blue overlay that follows the scan line (using Hexoprint blue light #96CFE7)
        const scanPos = float(uScanProgress.value);
        const uvY = uv().y;
        const scanWidth = float(0.05);
        const scanLine = smoothstep(0, scanWidth, abs(uvY.sub(scanPos)));
        // Hexoprint blue light #96CFE7 = rgb(150, 207, 231) = vec3(0.588, 0.812, 0.906)
        const blueOverlay = vec3(0.588, 0.812, 0.906)
            .mul(oneMinus(scanLine))
            .mul(0.8);

        // Mix the original scene with the blue overlay
        const withScanEffect = mix(
            scenePassColor,
            add(scenePassColor, blueOverlay),
            fullScreenEffect ? smoothstep(0.9, 1.0, oneMinus(scanLine)) : 0.8
        );

        // Add bloom effect after scan effect
        const final = withScanEffect.add(bloomPass);

        postProcessing.outputNode = final;

        return postProcessing;
    }, [camera, gl, scene, strength, threshold, fullScreenEffect]);

    useFrame(({ clock }) => {
        // Animate the scan line from top to bottom
        progressRef.current.value =
            Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5;
        render.renderAsync();
    }, 1);

    return null;
};

const WIDTH = 300;
const HEIGHT = 300;

const Scene = () => {
    const [rawMap, depthMap] = useTexture([TEXTUREMAP.src, DEPTHMAP.src]);

    const meshRef = useRef<Mesh>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Показываем изображение после загрузки текстур
        if (rawMap && depthMap) {
            setVisible(true);
        }
    }, [rawMap, depthMap]);

    const { material, uniforms } = useMemo(() => {
        const uPointer = uniform(new THREE.Vector2(0));
        const uProgress = uniform(0);

        const strength = 0.01;

        const tDepthMap = texture(depthMap);

        const tMap = texture(
            rawMap,
            uv().add(tDepthMap.r.mul(uPointer).mul(strength))
        );

        const aspect = float(WIDTH).div(HEIGHT);
        const tUv = vec2(uv().x.mul(aspect), uv().y);

        const tiling = vec2(120.0);
        const tiledUv = mod(tUv.mul(tiling), 2.0).sub(1.0);

        const brightness = mx_cell_noise_float(tUv.mul(tiling).div(2));

        const dist = float(tiledUv.length());
        const dot = float(smoothstep(0.5, 0.49, dist)).mul(brightness);

        const depth = tDepthMap;

        const flow = oneMinus(smoothstep(0, 0.02, abs(depth.sub(uProgress))));

        const mask = dot.mul(flow).mul(vec3(0.588, 0.812, 0.906).mul(2.0));

        const final = blendScreen(tMap, mask);

        const material = new THREE.MeshBasicNodeMaterial({
            colorNode: final,
            transparent: true,
            opacity: 0,
        });

        return {
            material,
            uniforms: {
                uPointer,
                uProgress,
            },
        };
    }, [rawMap, depthMap]);

    const [w, h] = useAspect(WIDTH, HEIGHT);

    useFrame(({ clock }) => {
        uniforms.uProgress.value =
            Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5;
        // Плавное появление
        if (
            meshRef.current &&
            'material' in meshRef.current &&
            meshRef.current.material
        ) {
            const mat = meshRef.current.material as any;
            if ('opacity' in mat) {
                mat.opacity = THREE.MathUtils.lerp(
                    mat.opacity,
                    visible ? 1 : 0,
                    0.07
                );
            }
        }
    });

    useFrame(({ pointer }) => {
        uniforms.uPointer.value = pointer;
    });

    const scaleFactor = 0.4;
    return (
        <mesh
            ref={meshRef}
            scale={[w * scaleFactor, h * scaleFactor, 1]}
            material={material}
        >
            <planeGeometry />
        </mesh>
    );
};

type HeroFuturisticProps = {
    title?: string;
    subtitle?: string;
    buttonText?: string;
};

export function Html(props: HeroFuturisticProps) {
    const {
        title = 'Build Your Dreams',
        subtitle = 'AI-powered creativity for the next generation.',
        buttonText = 'Découvrez nos services',
    } = props;

    const titleWords = title.split(' ');
    const [visibleWords, setVisibleWords] = useState(0);
    const [subtitleVisible, setSubtitleVisible] = useState(false);
    const [delays, setDelays] = useState<number[]>([]);
    const [subtitleDelay, setSubtitleDelay] = useState(0);

    useEffect(() => {
        setDelays(titleWords.map(() => Math.random() * 0.07));
        setSubtitleDelay(Math.random() * 0.1);
    }, [titleWords.length]);

    useEffect(() => {
        if (visibleWords < titleWords.length) {
            const timeout = setTimeout(
                () => setVisibleWords(visibleWords + 1),
                600
            );
            return () => clearTimeout(timeout);
        } else {
            const timeout = setTimeout(() => setSubtitleVisible(true), 800);
            return () => clearTimeout(timeout);
        }
    }, [visibleWords, titleWords.length]);

    return (
        <div className='h-svh relative'>
            <div className='h-svh uppercase items-center w-full absolute z-60 pointer-events-none px-10 flex justify-center flex-col'>
                <div className='font-serif font-bold text-3xl md:text-5xl xl:text-6xl 2xl:text-7xl leading-tight tracking-tight'>
                    <div className='flex space-x-2 lg:space-x-6 overflow-hidden text-white'>
                        {titleWords.map((word, index) => (
                            <div
                                key={index}
                                className={
                                    index < visibleWords ? 'fade-in' : ''
                                }
                                style={{
                                    animationDelay: `${
                                        index * 0.13 + (delays[index] || 0)
                                    }s`,
                                    opacity:
                                        index < visibleWords ? undefined : 0,
                                }}
                            >
                                {word}
                            </div>
                        ))}
                    </div>
                </div>
                <div className='text-xs md:text-xl xl:text-2xl 2xl:text-3xl mt-2 overflow-hidden text-white font-bold'>
                    <div
                        className={subtitleVisible ? 'fade-in-subtitle' : ''}
                        style={{
                            animationDelay: `${
                                titleWords.length * 0.13 + 0.2 + subtitleDelay
                            }s`,
                            opacity: subtitleVisible ? undefined : 0,
                        }}
                    >
                        {subtitle}
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <ScrollIndicator text={buttonText} />

            <Canvas
                flat
                gl={async (props) => {
                    const renderer = new THREE.WebGPURenderer(props as any);
                    await renderer.init();
                    return renderer;
                }}
            >
                <PostProcessing fullScreenEffect={true} />
                <Scene />
            </Canvas>
        </div>
    );
}

export default Html;
