
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button'; // Usando Button de shadcn
import { Input } from '@/components/ui/input'; // Asumiendo que Input de shadcn está disponible o será creado
import { Label } from '@/components/ui/label'; // Asumiendo que Label de shadcn está disponible o será creado

const ChangePasswordPage = () => {
  // TODO: Implementar lógica de cambio de contraseña
  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para enviar datos del formulario
    console.log("Formulario de cambio de contraseña enviado");
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 flex flex-col items-center">
        <div className="w-full max-w-md bg-card p-8 rounded-lg shadow-md mt-10">
          <h1 className="text-3xl font-bold mb-6 text-center text-primary">Cambiar Contraseña</h1>
          <p className="text-muted-foreground mb-6 text-center">
            Elige una contraseña segura y no la utilices para otras cuentas.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="current-password">Contraseña Actual</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="••••••••"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="new-password">Nueva Contraseña</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                className="mt-1"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Actualizar Contraseña
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/dashboard" className="text-sm text-primary hover:underline">
              Volver al Dashboard
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChangePasswordPage;
