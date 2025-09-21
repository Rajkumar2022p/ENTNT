import { createServer, Model } from "miragejs";
import { db as dexieDB } from "../db/dexie"; // Import Dexie

export function makeServer() {
  createServer({
    models: {
      job: Model,
    },

    seeds: async (server) => {
      const dexieJobs = await dexieDB.jobs.toArray();

      if (dexieJobs.length > 0) {
        dexieJobs.forEach((job) => {
          server.create("job", job);
        });
      } else {
        // Default jobs if none in Dexie
        const defaultJobs = [
          {
            title: "Frontend Developer",
            location: "Remote",
            description: "Build UI using React and Bootstrap",
          },
          {
            title: "Backend Developer",
            location: "Bangalore",
            description: "Work with Node.js and Express",
          },
        ];

        // Insert into Dexie and Mirage both
        for (const job of defaultJobs) {
          await dexieDB.jobs.add(job);
          server.create("job", job);
        }
      }
    },

    routes() {
      this.namespace = "api";

      this.get("/jobs", (schema) => {
        return schema.jobs.all();
      });

      this.post("/jobs", async (schema, request) => {
        const attrs = JSON.parse(request.requestBody);

        const saved = await dexieDB.jobs.add(attrs); // save to Dexie
        return schema.jobs.create({ id: saved, ...attrs }); // save to Mirage
      });

      this.delete("/jobs/:id", async (schema, request) => {
        let id = request.params.id;

        await dexieDB.jobs.delete(Number(id)); // delete from Dexie
        return schema.jobs.find(id).destroy(); // delete from Mirage
      });

      this.put("/jobs/:id", async (schema, request) => {
        const id = Number(request.params.id);
        const attrs = JSON.parse(request.requestBody);

        await dexieDB.jobs.update(id, attrs); // update Dexie
        return schema.jobs.find(id).update(attrs); // update Mirage
      });
    },
  });
}
