import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, useGSAP);

// Organic growth curves — register once, use by name throughout
CustomEase.create('biome.grow',    'M0,0 C0.1,0 0.2,1 1,1');
CustomEase.create('biome.settle',  'M0,0 C0.25,0.1 0.25,1 1,1');
CustomEase.create('biome.breathe', 'M0,0 C0.45,0 0.55,1 1,1');

export { gsap, ScrollTrigger, SplitText, CustomEase, useGSAP };
