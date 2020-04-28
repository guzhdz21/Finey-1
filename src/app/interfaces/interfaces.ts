
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

export interface GastosMensuales {
    mes: number;
    gastos: GastoMensual[];
}

export interface GastoMensual {
    nombre: string;
    cantidad: number;
}

export interface UsuarioLocal {
    nombre: string;
    sexo: string;
    tipoIngreso: string;
    ingresoCantidad: number;
    gastos: Gasto[];
    fondoPlanes: number;
    fondoAhorro: number;
}

export interface Plan {
    nombre: string;
    cantidadTotal: number;
    tiempoTotal: number;
    cantidadAcumulada: number;
    tiempoRestante: number;
    descripcion: string;
    aportacionMensual: number;
    pausado: boolean
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

export interface Test {
    id: number;
    nombre: string;
    texto: string;
    subTests: SubTest[];
}

export interface SubTest {
    idTest: number;
    id: number;
    preguntas: Pregunta[];
}

export interface Pregunta {
    idTest: number;
    idSubTest: number;
    id: number;
    preguntaTexto: string;
    respuestas: Respuesta[];
}

export interface Respuesta {
    respuestaTexto: string;
    valor: number;
}

export interface GastoMayor {
    nombre: string;
    mayor: boolean;
    cantidadOriginal: number;
    cantidadNueva: number; 
}