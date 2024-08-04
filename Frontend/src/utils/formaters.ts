export const formatExperience = (exp: number) : string => {
    if (exp < 1000) {
        return exp.toString();
    } else if (exp < 1000000) {
        return (exp / 1000).toFixed(exp % 1000 === 0 ? 0 : 1) + 'k';
    } else {
        return (exp / 1000000).toFixed(exp % 1000000 === 0 ? 0 : 1) + 'm';
    }
};