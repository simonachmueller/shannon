// Copyright (C) 2025 Keygraph, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License version 3
// as published by the Free Software Foundation.

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import {
  SaveDeliverableInputSchema,
  createSaveDeliverableHandler,
} from './tools/save-deliverable.js';
import { GenerateTotpInputSchema, generateTotp } from './tools/generate-totp.js';

async function start(): Promise<void> {
  const targetDir = process.env.SHANNON_TARGET_DIR;
  if (!targetDir) {
    throw new Error('SHANNON_TARGET_DIR environment variable is required');
  }

  const server = new McpServer({
    name: 'shannon-helper',
    version: '1.0.0',
  });

  const saveDeliverable = createSaveDeliverableHandler(targetDir);

  server.tool(
    'save_deliverable',
    'Saves deliverable files with automatic validation. Queue files must have {"vulnerabilities": [...]} structure.',
    SaveDeliverableInputSchema.shape,
    saveDeliverable
  );

  server.tool(
    'generate_totp',
    'Generates 6-digit TOTP code for authentication. Secret must be base32-encoded.',
    GenerateTotpInputSchema.shape,
    generateTotp
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

void start().catch((error) => {
  const message = error instanceof Error ? error.stack || error.message : String(error);
  process.stderr.write(`[shannon-helper] ${message}\n`);
  process.exit(1);
});
