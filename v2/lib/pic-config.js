// lib/pic-config.js — Static PIC mapping (loaded from data/pic-config.json)
import data from "../data/pic-config.json" with { type: "json" };

export const PIC_CONFIG = data;
export const PIC_BY_SLUG = Object.fromEntries(data.pics.map(p => [p.slug, p]));
export const PIC_BY_NAME = Object.fromEntries(data.pics.map(p => [p.name, p]));