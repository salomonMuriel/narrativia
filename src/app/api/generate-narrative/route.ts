import { NextResponse } from 'next/server';
import { Agent, run } from '@openai/agents';
import { z } from 'zod';
import { NARRATIVE_EXAMPLES } from '@/lib/narrative-examples';

interface UserInfo {
  name: string;
  age: number;
  city: string;
  neighborhood: string;
}

/**
 * Multi-Agent System for Personalized Narrative Generation
 *
 * Model Selection Strategy (Option A - Balanced):
 * - Research agents: gpt-4.1-mini (1M context, factual accuracy, affordable)
 * - Validation: gpt-4o-mini (100% JSON schema accuracy, proven)
 * - Narrative: gpt-4o (warmth and emotional connection for storytelling)
 *
 * Total cost per request: ~$0.028 (3 cents)
 * Expected latency: 5-10 seconds
 */

// Define the agents following the deterministic pattern

// Agent 1: Research the city and neighborhood
// Model: gpt-4.1-mini - Best for factual research with 1M context window
// Cost: $0.40 input / $1.60 output per 1M tokens (~$0.003 per request)
const researchAgent = new Agent({
  name: 'research_agent',
  model: 'gpt-4.1-mini',
  instructions: `Eres un investigador experto en Colombia que busca información sobre ciudades y barrios.

Tu tarea es investigar y proporcionar información detallada sobre una ciudad y barrio específico de Colombia.

Busca información sobre:
- **Landmarks y lugares emblemáticos**: parques, plazas, monumentos, edificios históricos, espacios públicos conocidos
- **Problemas sociales actuales**: basándose en noticias y situaciones de los últimos 2 años (2023-2025) como inseguridad, infraestructura, servicios públicos, convivencia
- **Características culturales y sociales específicas del barrio**
- **Actividades económicas principales y comercio local**
- **Composición demográfica y perfil de habitantes**
- **Iniciativas comunitarias conocidas**
- **Desafíos específicos que enfrentan personas de diferentes edades en esta zona**

IMPORTANTE: Enfócate en detalles concretos y específicos que permitan crear historias auténticas sobre la vida real en ese lugar.`,
});

// Agent 2: Research socioeconomic profile
// Model: gpt-4.1-mini - Same as research agent for consistency
// Cost: $0.40 input / $1.60 output per 1M tokens (~$0.002 per request)
const socioeconomicAgent = new Agent({
  name: 'socioeconomic_agent',
  model: 'gpt-4.1-mini',
  instructions: `Eres un analista socioeconómico experto en Colombia que investiga el perfil económico y social de barrios y comunidades.

Tu tarea es investigar y proporcionar información sobre el nivel socioeconómico típico de un barrio específico en Colombia.

Busca información sobre:
- **Estrato socioeconómico predominante** (1-6 en el sistema colombiano)
- **Nivel de ingresos típico** de los habitantes
- **Tipo de vivienda predominante** (casas, apartamentos, conjuntos, barrios populares)
- **Acceso a servicios básicos** (agua, luz, internet, transporte público)
- **Nivel educativo predominante** de los residentes
- **Tipos de empleo comunes** en la zona (formal, informal, profesional, comercio)
- **Calidad de infraestructura pública** (vías, parques, centros de salud, colegios)
- **Indicadores de calidad de vida** específicos del barrio

IMPORTANTE:
- Sé preciso y realista cuando encuentres información específica del barrio
- Si NO encuentras información confiable o el barrio es poco conocido, ASUME explícitamente un perfil de CLASE MEDIA COLOMBIANA (estratos 3-4)
- Si asumes clase media por falta de datos, menciona claramente: "Por falta de información específica del barrio, se asume un perfil de clase media típica colombiana"
- Esta información ayudará a crear personajes y situaciones auténticas que reflejen la realidad socioeconómica del lugar`,
});

// Agent 3: Validate the research quality
// Model: gpt-4o-mini - 100% proven JSON schema accuracy for structured output
// Cost: $0.15 input / $0.60 output per 1M tokens (~$0.0004 per request)
const researchValidatorAgent = new Agent({
  name: 'research_validator_agent',
  model: 'gpt-4o-mini',
  instructions: `Evalúa la calidad de la investigación sobre una ciudad y barrio colombiano.

Determina si:
1. La información es suficientemente detallada y específica
2. Incluye contexto cultural relevante
3. Menciona aspectos tanto positivos como desafíos
4. Es útil para crear una narrativa personalizada

Responde con tu evaluación estructurada.`,
  outputType: z.object({
    is_detailed: z.boolean().describe('La investigación tiene suficientes detalles específicos'),
    has_cultural_context: z.boolean().describe('Incluye contexto cultural relevante'),
    is_useful: z.boolean().describe('Es útil para crear una narrativa personalizada'),
  }),
});

// Agent 4: Generate the personalized narrative
// Model: gpt-4o - Best for creative warmth and emotional connection in storytelling
// Cost: $2.50 input / $10.00 output per 1M tokens (~$0.023 per request)
const narrativeAgent = new Agent({
  name: 'narrative_agent',
  model: 'gpt-4o',
  instructions: `Eres un escritor experto en narrativas inspiradoras sobre Colombia y el movimiento "Colombia es Buena".

Tu tarea es crear una narrativa personalizada escrita en el futuro (año 2028) sobre cómo el movimiento "Colombia es buena y vale la pena cuidarla" transformó la vida en una ciudad y barrio específico de Colombia.

EJEMPLOS DE NARRATIVAS DEL MOVIMIENTO:
${NARRATIVE_EXAMPLES}

INSTRUCCIONES PARA LA NARRATIVA:

**IMPORTANTE - NO USES EL NOMBRE DEL USUARIO:**
- Crea un PERSONAJE FICTICIO con nombre inventado
- Dale detalles personales inventados (algunos tienen hijos, otros no; diferentes profesiones, situaciones familiares variadas)
- El lector debe identificarse con la historia por la UBICACIÓN (ciudad/barrio), la EDAD, y los PROBLEMAS/LANDMARKS que menciones
- El personaje ficticio es un vehículo para contar la transformación del lugar y la comunidad

**ESTRUCTURA DE LA NARRATIVA (3 niveles entrelazados):**

1. **Historia Individual**: Sigue la vida de UN personaje ficticio principal
   - Nombre inventado apropiado para la edad
   - Situación personal específica (profesión, estado familiar)
   - Cómo cambió su mentalidad y acciones diarias

2. **Historia Familiar**: Muestra el impacto en una familia
   - Puede ser la familia del personaje principal u otra familia mencionada
   - Cambios en dinámicas familiares, rutinas, espacios compartidos
   - Cómo diferentes generaciones participaron

3. **Historia Comunitaria**: Transforma el barrio y la ciudad
   - Usa landmarks específicos de la investigación
   - Menciona problemas reales de los últimos 2 años que mejoraron
   - Muestra vecinos colaborando, espacios públicos transformados
   - Iniciativas colectivas específicas al lugar

**CONEXIÓN CON EL LECTOR:**
- Usa la EDAD proporcionada para que el personaje tenga preocupaciones/experiencias relevantes para esa edad
- Usa LANDMARKS del barrio/ciudad para crear familiaridad ("ese parque donde...", "esa esquina donde...")
- Menciona PROBLEMAS REALES de la zona que están mejorando (basura, inseguridad, deterioro, etc.)
- Refleja el NIVEL SOCIOECONÓMICO del barrio en los detalles (tipo de trabajo, preocupaciones económicas, aspiraciones, estilo de vida)

**TONO Y ESTILO (inspirado en los ejemplos del movimiento):**
- Esperanzador pero realista - nunca melodramático
- Emotivo pero digno y respetuoso
- Inspirador y motivador
- Conectado con la identidad colombiana
- Primera persona desde el personaje ficticio en 2028
- Usa PÁRRAFOS CORTOS de 1-3 oraciones para ritmo y énfasis
- Emplea REPETICIÓN para reforzar ideas clave ("Cuidamos el parque. Cuidamos la esquina. Cuidamos a Colombia.")
- Incluye LENGUAJE METAFÓRICO del movimiento ("Motores de Esperanza", "tejer comunidad", "sembrar cambio")
- Usa preguntas retóricas ocasionales para involucrar al lector
- Combina lo concreto (nombres de lugares) con lo simbólico (significado del cuidado)

**DETALLES ESPECÍFICOS A INCLUIR:**
- Cómo el movimiento llegó al barrio en 2025-2026
- Acciones concretas de cuidado (limpieza, seguridad, cultura, educación)
- Cambios en lugares específicos (parques, calles, esquinas conocidas)
- Conexiones entre vecinos y la comunidad
- Transformación de problemas sociales específicos del área

**FORMATO:**
- MÁXIMO 1000 palabras (ESTRICTO - no exceder)
- 800-1000 palabras ideal
- Encabezados (##) para secciones
- Negritas (**) para momentos clave y llamados a la acción
- Cursivas (_) para reflexiones personales íntimas
- Estructura sugerida:
  ## Mi Historia: [Barrio], [Ciudad] 2028
  ## Una Persona, Una Familia, Una Comunidad
  ## Cuidar es Construir

CRÍTICO: La narrativa debe hacer que el lector piense "Eso es MI barrio, ESA es mi realidad, YO podría ser parte de ese cambio" - no por el nombre, sino por el LUGAR y los DETALLES que reconoce.`,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, age, city, neighborhood }: UserInfo = body;

    // Validate input
    if (!name || !age || !city || !neighborhood) {
      return NextResponse.json(
        { success: false, message: 'Faltan datos requeridos: nombre, edad, ciudad y barrio son obligatorios' },
        { status: 400 }
      );
    }

    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, message: 'OpenAI API key no configurada' },
        { status: 500 }
      );
    }

    console.log('Starting deterministic narrative generation for:', { name, age, city, neighborhood });

    // Step 1 & 2: Research city/neighborhood and socioeconomic profile IN PARALLEL
    console.log('Step 1 & 2: Researching city, neighborhood, and socioeconomic profile in parallel...');

    const researchPrompt = `Investiga y proporciona información detallada sobre:
Ciudad: ${city}
Barrio: ${neighborhood}

Enfócate especialmente en:
1. LANDMARKS: Lugares emblemáticos, parques, plazas, monumentos, espacios públicos conocidos
2. PROBLEMAS SOCIALES: Noticias y situaciones de los últimos 2 años (2023-2025) - inseguridad, infraestructura, basuras, servicios públicos
3. CONTEXTO PARA EDAD ${age}: Qué desafíos/experiencias viven personas de esta edad en esta zona

Sé específico con nombres de lugares y problemas reales.`;

    const socioeconomicPrompt = `Investiga el perfil socioeconómico de:
Ciudad: ${city}
Barrio: ${neighborhood}

Proporciona información detallada sobre:
- Estrato socioeconómico predominante
- Nivel de ingresos y tipo de empleo común
- Tipo de vivienda y calidad de infraestructura
- Acceso a servicios y calidad de vida
- Nivel educativo de los residentes

Esta información se usará para crear personajes auténticos y realistas para este barrio específico.

IMPORTANTE: Si no encuentras información suficiente sobre este barrio específico, ASUME un perfil de clase media colombiana (estratos 3-4) y menciona explícitamente que estás haciendo esta asunción por falta de datos específicos.`;

    // Run both research agents in parallel
    const [researchResult, socioeconomicResult] = await Promise.all([
      run(researchAgent, researchPrompt),
      run(socioeconomicAgent, socioeconomicPrompt),
    ]);

    if (!researchResult.finalOutput) {
      throw new Error('No se pudo obtener información de investigación');
    }

    if (!socioeconomicResult.finalOutput) {
      throw new Error('No se pudo obtener información socioeconómica');
    }

    console.log('Parallel research completed');

    // Step 3: Validate the research
    console.log('Step 3: Validating research quality...');
    const validationResult = await run(researchValidatorAgent, researchResult.finalOutput);

    const validation = validationResult.finalOutput;
    if (!validation) {
      throw new Error('No se pudo validar la investigación');
    }

    // Step 4: Gate - check if research is good enough
    if (!validation.is_detailed || !validation.has_cultural_context || !validation.is_useful) {
      console.log('Research quality insufficient, proceeding with available information...');
      // Continue anyway but log the issue
    } else {
      console.log('Research quality validated successfully');
    }

    // Step 5: Generate the personalized narrative
    console.log('Step 4: Generating personalized narrative...');
    const narrativeAge = age + 5; // Character is 5 years older than the user
    const narrativePrompt = `Usando la siguiente información de investigación sobre ${city} - ${neighborhood}:

INVESTIGACIÓN GEOGRÁFICA Y CULTURAL:
${researchResult.finalOutput}

PERFIL SOCIOECONÓMICO:
${socioeconomicResult.finalOutput}

Genera una narrativa personalizada para alguien que vive en:
- Edad del lector: ${age} años
- Edad del personaje narrador: ${narrativeAge} años (5 años mayor que el lector)
- Ciudad: ${city}
- Barrio: ${neighborhood}

IMPORTANTE:
- NO uses el nombre "${name}" - crea un PERSONAJE FICTICIO con nombre inventado
- El personaje narrador y el lector NO SE CONOCEN - son personas completamente separadas
- El narrador tiene ${narrativeAge} años y vive en ${neighborhood}, ${city}
- El lector tiene ${age} años y también vive en ${neighborhood}, ${city}
- La conexión NO es personal sino geográfica y generacional
- El narrador cuenta SU PROPIA historia de transformación en 2028
- El lector se identifica porque reconoce los MISMOS LUGARES, los MISMOS PROBLEMAS, y tiene una EDAD SIMILAR
- La perspectiva de 5 años mayor añade esperanza: "Si alguien un poco mayor que yo pudo ser parte del cambio, yo también puedo"
- La narrativa debe tocar 3 niveles: vida de UNA PERSONA (ficticia), de UNA FAMILIA, y de LA COMUNIDAD
- Usa los landmarks y problemas específicos de la investigación geográfica
- Refleja el PERFIL SOCIOECONÓMICO en los detalles del personaje (trabajo, preocupaciones, aspiraciones, estilo de vida)
- El lector debe pensar: "Esa persona vive donde yo vivo, tiene casi mi edad, enfrenta lo que yo enfrento. Si eso fue posible para ellos, es posible para mí."

Escribe en primera persona desde un personaje ficticio de ${narrativeAge} años, ambientado en el año 2028, contando cómo el movimiento "Colombia es buena y vale la pena cuidarla" transformó ${neighborhood}, ${city}.`;

    const narrativeResult = await run(narrativeAgent, narrativePrompt);

    const narrative = narrativeResult.finalOutput;

    if (!narrative) {
      throw new Error('No se pudo generar la narrativa');
    }

    console.log('Narrative generated successfully');

    return NextResponse.json({
      success: true,
      narrative,
      research: {
        geographic: researchResult.finalOutput,
        socioeconomic: socioeconomicResult.finalOutput,
      },
      validation,
      metadata: {
        name,
        age,
        city,
        neighborhood,
        generatedAt: new Date().toISOString(),
        steps: {
          geographic_research_completed: true,
          socioeconomic_research_completed: true,
          validation_passed: validation.is_detailed && validation.has_cultural_context && validation.is_useful,
          narrative_generated: true,
        }
      }
    });

  } catch (error) {
    console.error('Error generating narrative:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Error al generar la narrativa',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
