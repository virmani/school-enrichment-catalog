import { createObjectCsvWriter } from 'csv-writer';
import * as path from 'path';
import * as fs from 'fs';
import { EnrichedClass, ExportMetadata } from '../types';

export class CSVExporter {
  async export(
    classes: EnrichedClass[],
    metadata: ExportMetadata,
    outputDir: string,
    filename?: string
  ): Promise<string> {
    const gradeLabel = metadata.gradeFilter || 'all';
    const defaultFilename = `enrichment-${gradeLabel}.csv`;
    const finalFilename = filename || defaultFilename;
    const outputPath = path.join(outputDir, finalFilename);

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const csvWriter = createObjectCsvWriter({
      path: outputPath,
      header: [
        { id: 'sessionId', title: 'Session ID' },
        { id: 'name', title: 'Class Name' },
        { id: 'gradeRange', title: 'Grade Range' },
        { id: 'instructor', title: 'Instructor' },
        { id: 'dayOfWeek', title: 'Day of Week' },
        { id: 'time', title: 'Time' },
        { id: 'startDate', title: 'Start Date' },
        { id: 'endDate', title: 'End Date' },
        { id: 'numberOfClasses', title: 'Number of Classes' },
        { id: 'location', title: 'Location' },
        { id: 'cost', title: 'Cost' },
        { id: 'programOverview', title: 'Program Overview' },
        { id: 'sessionDetailUrl', title: 'Detail URL' },
      ],
    });

    const records = classes.map((cls) => ({
      sessionId: cls.sessionId,
      name: cls.name,
      gradeRange: cls.gradeRange,
      instructor: cls.instructor,
      dayOfWeek: cls.dayOfWeek,
      time: cls.time,
      startDate: cls.startDate,
      endDate: cls.endDate,
      numberOfClasses: cls.numberOfClasses?.toString() || '',
      location: cls.location,
      cost: cls.cost,
      programOverview: cls.programOverview,
      sessionDetailUrl: cls.sessionDetailUrl,
    }));

    await csvWriter.writeRecords(records);

    return outputPath;
  }
}
