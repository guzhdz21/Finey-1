export interface Opcion {
    icono: string;
    nombre: string;
    redirigirA: string;
}

export interface Rubro {
    nombre: string;
    color: string;
    texto: string;
    tipo: string;
}

export interface ColorArray {
    colores: string[];
}

export interface LabelArray {
    nombre: string[];
}

export interface Gasto {
    nombre: string;
    cantidad: number;
    tipo: string;
    porcentaje: string;
    icono: string;
    margenMin: number;
    margenMax: number;
}

export interface UsuarioLocal {
    nombre: string;
    sexo: string;
    tipoIngreso: string;
    ingresoCantidad: number;
    gastos: Gasto[];
}