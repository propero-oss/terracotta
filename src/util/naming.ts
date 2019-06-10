

export function toKebapCase(str: string): string {
  // SMTPServerConnection => SmtpServerConnection
  // testSMTPServerConnection => testSmtpServerConnection
  str = str.replace(/[A-Z]{2,}/g, match => match[0] + match.substring(1, match.length - 1).toLowerCase() + match.substr(match.length + 1));
  // SmtpServerConnection => -smtp-server-connection
  // testSmtpServerConnection => test-smtp-server-connection
  str = str.replace(/[A-Z]/g, match => '-' + match.toLowerCase());
  // -smtp-server-connection => smtp-server-connection
  return str.replace(/^-/,'');
}
