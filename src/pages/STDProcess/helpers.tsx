import React from 'react';
import * as Icons from 'lucide-react';

export const getCategoryStyle = (category: string) => {
    switch (category?.toUpperCase()) {
        case 'SAUSAGE': return 'bg-white text-[#C22D2E] border-[#C22D2E]/30';
        case 'MEATBALL': return 'bg-white text-[#55738D] border-[#55738D]/30';
        case 'BOLOGNA': return 'bg-white text-[#BB8588] border-[#BB8588]/30';
        case 'HAM': return 'bg-white text-[#B06821] border-[#D8A48F]/30';
        case 'WIP-EMULSION': return 'bg-white text-[#537E72] border-[#537E72]/30';
        default: return 'bg-white text-[#737597] border-[#E6E1DB]';
    }
};

export const getStatusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
        case 'ACTIVE': return 'bg-white text-[#3A7283] border-[#3A7283]/60';
        case 'INACTIVE': return 'bg-white text-[#94A3B8] border-[#94A3B8]/60';
        case 'DRAFT': return 'bg-white text-[#B06821] border-[#B06821]/60';
        default: return 'bg-white text-gray-400 border-gray-300';
    }
};

export const kebabToPascal = (str: string) => str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');

export const LucideIcon = ({ name, size = 16, className = "", color, style }: any) => {
    if (!name) return <Icons.HelpCircle size={size} className={className} style={style} />;
    const pascalName = kebabToPascal(name);
    const IconComponent = (Icons as any)[pascalName] || (Icons as any)[`${pascalName}Icon`] || Icons.CircleHelp || Icons.Activity;
    if (!IconComponent) return null;
    return <IconComponent size={size} className={className} style={{...style, color: color}} strokeWidth={2} />;
};

export const StandardModalWrapper = ({ children, className }: any) => (
    <div className={`relative ${className}`} onClick={(e: any) => e.stopPropagation()}>
        {children}
    </div>
);
