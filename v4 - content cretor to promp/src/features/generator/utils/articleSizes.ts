export const getArticleSize = (size: string) => {
  const sizes = {
    mini: {
      range: '800-1200',
      h2: '3-4',
      sections: {
        intro: 100,
        body: '600-900',
        conclusion: '100-200',
      },
    },
    small: {
      range: '1200-2000',
      h2: '4-6',
      sections: {
        intro: '150-200',
        body: '900-1600',
        conclusion: '150-200',
      },
    },
    medium: {
      range: '2000-3000',
      h2: '6-8',
      sections: {
        intro: '200-300',
        body: '1600-2400',
        conclusion: '200-300',
      },
    },
    large: {
      range: '3000-4000',
      h2: '8-10',
      sections: {
        intro: '300-400',
        body: '2400-3200',
        conclusion: '300-400',
      },
    },
    xlarge: {
      range: '4000+',
      h2: '10+',
      sections: {
        intro: '400-500',
        body: '3200+',
        conclusion: '400-500',
      },
    },
  };
  return sizes[size] || sizes['medium'];
};