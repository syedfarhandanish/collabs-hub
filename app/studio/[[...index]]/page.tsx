'use client';

import { NextStudio } from 'next-sanity/studio';
// This steps out of [[...index]], out of studio, out of app, and into the root
import config from '../../../sanity.config'; 

export default function StudioPage() {
  return <NextStudio config={config} />;
}