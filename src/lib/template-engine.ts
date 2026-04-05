interface TemplateVars {
  city: string;
  state: string;
  state_full?: string;
  brand: string;
  phone?: string;
}

export function fillTemplate(template: string, vars: TemplateVars): string {
  return template
    .replace(/\{\{city\}\}/g, vars.city)
    .replace(/\{\{state\}\}/g, vars.state)
    .replace(/\{\{state_full\}\}/g, vars.state_full || vars.state)
    .replace(/\{\{brand\}\}/g, vars.brand)
    .replace(/\{\{phone\}\}/g, vars.phone || "");
}
