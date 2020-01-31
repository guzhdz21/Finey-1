export interface Opcion {
    icono: string;
    nombre: string;
    redirigirA: string;
}

export interface Rubro {
    nombre: string;
    color: string;
    texto: string;
}

export interface ColorArray {
    colores: string[];
}

export interface LabelArray {
    nombre: string[];
}

export interface Gasto {
    nombre: string;
    cantidad: string;
    tipo: string;
    porcenteja: string;
    icono: string;
}

export interface UsuarioLocal {
    nombre: string;
    sexo: string;
    tipoIngreso: string;
    ingresoCantida: number;
    gastos: Gasto[];
}