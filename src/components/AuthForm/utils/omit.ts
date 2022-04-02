export const omit = (
  data: object,
  props: string[]
) => {
  const entries = Object.entries(data);
  const propsX = props.map(prop => prop.toLowerCase());
  const filtred = entries.filter(prop => {
    const propX = prop[0].toLowerCase();
    return !propsX.includes(propX);
  });

  return Object.fromEntries(filtred);
};