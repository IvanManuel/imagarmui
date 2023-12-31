export const isValidEmail = (email: string): boolean => {
  
  const match = String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );

    return !!match;
};

export const isEmail = (email: string): string | undefined => {
  return isValidEmail(email) 
    ? undefined
    : 'El correo no parece ser válido';
}

export const isValidPassword = (password: string): boolean => {
  
    const match = String(password)
        .match(
          "(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
        );
  
      return !!match;
  };

  export const passwordRegex = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[$@$!%*?&#.$($)$-$_])[A-Za-z\\d$@$!%*?&#.$($)$-$_]{8,32}$';
  export const onlyNumbers = '^([0-9]){0,30}$';