
import React from 'react';

/**
 * Componente UserAvatar para mostrar iniciales de usuario en un círculo coloreado.
 * @param {object} props - Propiedades del componente.
 * @param {string} props.name - Nombre del usuario.
 * @param {'xs' | 'sm' | 'md' | 'lg'} [props.size='md'] - Tamaño del avatar.
 * @param {string} [props.className=''] - Clases CSS adicionales.
 */
const UserAvatar = ({ name, size = 'md', className = '', ...props }) => {
  const getInitials = (nameStr) => {
    if (!nameStr || typeof nameStr !== 'string') return '?';
    const nameTrimmed = nameStr.trim();
    if (!nameTrimmed) return '?';

    const words = nameTrimmed.split(' ').filter(Boolean);

    if (words.length === 0) return '?';

    if (words.length === 1) {
      if (words[0].length === 1) return words[0][0].toUpperCase();
      // Tomar las dos primeras letras si es una sola palabra
      return (words[0][0] + (words[0][1] || '')).toUpperCase();
    }

    // Tomar la primera letra de las dos primeras palabras
    return (words[0][0] + (words[1][0] || '')).toUpperCase();
  };

  const avatarColors = [
    'bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500',
    'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500',
    'bg-teal-500', 'bg-cyan-500', 'bg-rose-500', 'bg-lime-500',
    'bg-emerald-500', 'bg-sky-500', 'bg-violet-500', 'bg-fuchsia-500'
  ];

  const getColorByName = (nameStr) => {
    if (!nameStr) return avatarColors[0];
    let hash = 0;
    for (let i = 0; i < nameStr.length; i++) {
      hash = nameStr.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash; // Convert to 32bit integer
    }
    const index = Math.abs(hash) % avatarColors.length;
    return avatarColors[index];
  };

  const initials = getInitials(name);
  const bgColor = getColorByName(name);

  const sizeClasses = {
    xs: 'w-3.5 h-3.5 text-[0.5rem] leading-tight', // 14px
    sm: 'w-6 h-6 text-xs',                      // 24px
    md: 'w-9 h-9 text-sm',                      // 36px
    lg: 'w-12 h-12 text-base',                   // 48px
  };

  return (
    <div
      className={`rounded-full flex items-center justify-center text-white font-semibold shrink-0 ${bgColor} ${sizeClasses[size] || sizeClasses.md} ${className}`}
      title={name || 'Usuario'}
      {...props}
    >
      {initials}
    </div>
  );
};

export default UserAvatar;
