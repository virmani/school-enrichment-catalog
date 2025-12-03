import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';
import { EnrichedClass, ExportMetadata, YAMLOutput } from '../types';

export class YAMLExporter {
  async export(
    classes: EnrichedClass[],
    metadata: ExportMetadata,
    outputDir: string,
    filename?: string
  ): Promise<string> {
    const gradeLabel = metadata.gradeFilter || 'all';
    const defaultFilename = `enrichment-${gradeLabel}.yaml`;
    const finalFilename = filename || defaultFilename;
    const outputPath = path.join(outputDir, finalFilename);

    const output: YAMLOutput = {
      metadata,
      classes,
    };

    const yamlContent = yaml.dump(output, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
    });

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, yamlContent, 'utf8');

    return outputPath;
  }
}
