export const downloadAsFile = (filename: string, extension: string, content: string) => {
  const element = document.createElement('a');
  element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`);
  element.setAttribute('download', `${filename}.${extension}`);
  element.style.display = 'none';

  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};