import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { SvgIconProps } from '@thesvg/react';

export type SkillIconComponent = ForwardRefExoticComponent<SvgIconProps & RefAttributes<SVGSVGElement>>;

export interface SkillCategory {
  title: string;
  icon: string;
  skills: string[];
}
