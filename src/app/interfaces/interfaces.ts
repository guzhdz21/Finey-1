import { SingleDataSet } from 'ng2-charts';

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

export interface Plan {
    nombre: string;
    cantidadTotal: number;
    tiempoTotal: number;
    cantidadAcumulada: number;
    tiempoRestante: number;
    descripcion: string;
    aportacionMensual: number;
}

export interface PlanDisplay {
    doughnutChartData: number[];
    plan: Plan;
}

export interface AlertaGeneral {
    titulo: string;
    mensaje: string;
}

export interface Recordatorio {
    title: string;
    mensaje: string;
    inicio: string;
    fin: string;
}