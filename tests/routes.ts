import { projects } from "../content/projects";

export const ROUTES = [
  "/",
  "/driver",
  "/races",
  ...projects.map((p) => `/races/${p.slug}`),
  "/seasons",
  "/garage",
  "/podium",
  "/pit-wall",
];
