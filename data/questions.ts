import { Question } from '../types';

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Según el artículo, ¿cuál es el propósito principal de la sección de Introducción en un artículo científico?",
    options: [
      { id: "A", text: "Describir minuciosamente la metodología utilizada para que el estudio sea reproducible" },
      { id: "B", text: "Interpretar los hallazgos del estudios y compararlos con la literatura previa" },
      { id: "C", text: "Justificar la necesidad del estudio, identificando una brecha en el conocimiento existente y estableciendo objetivos" },
      { id: "D", text: "Presentar en detalla los resultados del análisis estadístico" }
    ],
    correctOptionId: "C"
  },
  {
    id: 2,
    text: "¿Qué elemento crucial debe incluirse en la sección de Métodos de un estudio prospectivo que no es un componente de la misma sección en un estudio retrospectivo, según la Tabla 3?",
    options: [
      { id: "A", text: "La descripción del análisis estadístico a realizar" },
      { id: "B", text: "Las consideraciones éticas, como la probacion del comité" },
      { id: "C", text: "Los criterios de inclusión y no inclusión de los sujetos" },
      { id: "D", text: "El calculo del tamaño de la muestra" }
    ],
    correctOptionId: "D"
  },
  {
    id: 3,
    text: "Al redactar la sección de Resultados, ¿qué práctica desaconseja el artículo?",
    options: [
      { id: "A", text: "Incluir comentarios o interpretaciones como “sorprende mente”" },
      { id: "B", text: "Presentar los resultados en el mismo orden que los métodos" },
      { id: "C", text: "Utilizar el tiempo pasado para describir las observaciones realizadas" },
      { id: "D", text: "Hacer referencia a las tablas y figuras que ilustran los datos" }
    ],
    correctOptionId: "A"
  },
  {
    id: 4,
    text: "¿Cuál es la recomendación del artículo para criticar el trabajo de otros autores en la sección de Discusión?",
    options: [
      { id: "A", text: "Criticar explícitamente los trabajos previos para resaltar la superioridad del estudio actual" },
      { id: "B", text: "Señalar directamente las debilidades metodológicas, como la falta de poder estadístico" },
      { id: "C", text: "Evitar por completo la comparación con otros estudios para no generar controversia" },
      { id: "D", text: "Reformular las criticas como fortalezas del propio estudio, implicando las debilidades de otros indirectamente" }
    ],
    correctOptionId: "D"
  },
  {
    id: 5,
    text: "¿Por qué es crucial, según el texto, que el título de un artículo contenga los principales términos y palabras clave?",
    options: [
      { id: "A", text: "Para resumir los hallazgos principales del estudio de la manera más concisa posible" },
      { id: "B", text: "Para evitar el uso de subtítulos, que el articulo desaconseja en la mayoria de los casos" },
      { id: "C", text: "Para que el trabajo sea fácilmente identificable en búsqueda de bases de datos como PubMed y sea citado por otros" },
      { id: "D", text: "Para cumplir con el limite de caracteres impuestos por la mayoria de las revistas científicas" }
    ],
    correctOptionId: "C"
  },
  {
    id: 6,
    text: "¿Qué característica esencial debe tener el Resumen (Abstract) de un artículo científico?",
    options: [
      { id: "A", text: "Debe contener una sección de discusión que interprete los hallazgos" },
      { id: "B", text: "Debe incluir referencias a las publicaciones mas importantes citadas en el texto" },
      { id: "C", text: "Debe ser comprensible como una unidad independiente, sin necesidad de leer el articulo completo" },
      { id: "D", text: "Debe incluir figuras o tablas pequeñas para visualizar los datos mas importantes" }
    ],
    correctOptionId: "C"
  },
  {
    id: 7,
    text: "Al momento de elegir las referencias bibliográficas, ¿qué tipo de fuente sugiere el artículo priorizar?",
    options: [
      { id: "A", text: "Artículos de revisiones porque resumen el conocimiento actual" },
      { id: "B", text: "Artículos de investigación originales publicados en revistas por pares y en ingles" },
      { id: "C", text: "Comunicaciones personales y datos no publicados para mostrar originalidad" },
      { id: "D", text: "Sitios de internet de alta reputación para asegurar la informacion mas reciente" }
    ],
    correctOptionId: "B"
  },
  {
    id: 8,
    text: "¿Cuál es la función de enumerar las limitaciones del estudio en la sección de Discusión?",
    options: [
      { id: "A", text: "Demostrar honestidad y permitir al autor defenderse anticipadamente de posible criticas de los revisores" },
      { id: "B", text: "Llenar espacio para cumplir con la longitud mínima de la sección requerida por la revista" },
      { id: "C", text: "Indicar que los resultados no son validos y que el estudio debe ser replicado" },
      { id: "D", text: "Justificar porque los resultados fueron negativos o no concluyentes" }
    ],
    correctOptionId: "A"
  },
  {
    id: 9,
    text: "De acuerdo con el texto, ¿qué se debe hacer antes de escribir la primera palabra del artículo?",
    options: [
      { id: "A", text: "Identificar la revista de destino para adaptar el estilo y formato del manuscrito" },
      { id: "B", text: "Escribir la sección de Discusión para saber que conclusiones se quieren alcanzar" },
      { id: "C", text: "Crear todas las tablas y figuras que se incluirán en el manuscrito" },
      { id: "D", text: "Redactar el resumen (abstract) para tener una guia clara de todo el contenido" }
    ],
    correctOptionId: "A"
  },
  {
    id: 10,
    text: "En el contexto de la sección de Métodos, ¿qué información es fundamental incluir respecto a la población de estudio si se trata de sujetos humanos?",
    options: [
      { id: "A", text: "Los criterios detallados de inclusión y no inclusión" },
      { id: "B", text: "Los resultados del objetivo primario para cada subgrupo de la población" },
      { id: "C", text: "Un análisis demográfico completo con medias y desviaciones estándar" },
      { id: "D", text: "Únicamente el numero total de pacientes reclutados en el estudio" }
    ],
    correctOptionId: "A"
  }
];