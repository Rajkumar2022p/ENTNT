// src/mirage.js
import { createServer, Response } from "miragejs";
import { db } from "../db/dexie";

export function makeServer() {
  return createServer({
    routes() {
      this.namespace = "api";

      // ----- JOBS -----
      this.get("/jobs", async (schema, request) => {
        const jobs = await db.jobs.toArray();
        return jobs;
      });

      this.post("/jobs", async (schema, request) => {
        await randomDelay();
        if (randomFail()) return new Response(500, {}, { error: "Random error" });

        const attrs = JSON.parse(request.requestBody);
        const id = await db.jobs.add(attrs);
        return { ...attrs, id };
      });

      this.patch("/jobs/:id", async (schema, request) => {
        await randomDelay();
        if (randomFail()) return new Response(500, {}, { error: "Random error" });

        const { id } = request.params;
        const attrs = JSON.parse(request.requestBody);
        await db.jobs.update(Number(id), attrs);
        return { id: Number(id), ...attrs };
      });

      // ----- SUGGESTIONS -----
      this.get("/suggestions", async (schema, request) => {
        const candidateId = Number(request.queryParams.candidateId);
        const suggestions = await db.suggestions
          .filter((s) => s.candidateId === candidateId)
          .toArray();
        return suggestions;
      });

      this.post("/suggestions", async (schema, request) => {
        await randomDelay();
        if (randomFail()) return new Response(500, {}, { error: "Random error" });

        const attrs = JSON.parse(request.requestBody);
        const id = await db.suggestions.add(attrs);
        return { ...attrs, id };
      });

      this.patch("/suggestions/:id", async (schema, request) => {
        await randomDelay();
        if (randomFail()) return new Response(500, {}, { error: "Random error" });

        const { id } = request.params;
        const attrs = JSON.parse(request.requestBody);
        await db.suggestions.update(Number(id), attrs);
        return { id: Number(id), ...attrs };
      });
    },
  });
}

// --- Helpers ---
const randomDelay = () => new Promise((res) => setTimeout(res, 200 + Math.random() * 1000));
const randomFail = () => Math.random() < 0.1; // 10% chance
