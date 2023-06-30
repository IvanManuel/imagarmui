export const isValidEmail = (value: string): string | undefined => {
  let error;
  if (!value) {
    error = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    error = 'Invalid email address';
  }
  return error;
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