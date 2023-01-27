export function MatchExpression(str) {
   const regExp = {
      contains_alphaNumeric: /^(?!-)(?!.*-)[A-Za-z0-9-]+(?<!-)$/,
      containsNumber: /\d+/,
      containsAlphabet: /[a-zA-Z]/,
      onlyLetters: /^[A-Za-z]+$/,
      onlyNumbers: /^[0-9]+$/,
      onlyMixAlphaNmeric: /^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$/
   }

   let expMatch= {}
   expMatch.contains_alphaNumeric = regExp.contains_alphaNumeric.test(str)
   expMatch.containsNumber = regExp.containsNumber.test(str)
   expMatch.containsAlphabet = regExp.containsAlphabet.test(str)
   expMatch.onlyLetters = regExp.onlyLetters.test(str)
   expMatch.onlyNumbers = regExp.onlyNumbers.test(str)
   expMatch.onlyMixAlphaNmeric = regExp.onlyMixAlphaNmeric.test(str)

}