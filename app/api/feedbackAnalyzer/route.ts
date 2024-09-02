import nlp from 'compromise';


// export async function POST(request: Request) {
//   const { responses } = await request.json();

  // const stopwords = [
  //   'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd",
  //   'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers',
  //   'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which',
  //   'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been',
  //   'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if',
  //   'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between',
  //   'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out',
  //   'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why',
  //   'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
  //   'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should',
  //   "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't",
  //   'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn',
  //   "isn't", 'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn',
  //   "shouldn't", 'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't"
  // ];

//   const termCounts: { [term: string]: number } = {};

//   responses.forEach((response: string) => {
//     const doc = nlp(response);
//     const terms = doc.terms().out('array');

//     // Manually generate n-grams up to 3 terms long
//     const nGrams = generateNGrams(terms, 3);

//     nGrams.forEach((ngram: string) => {
//       const normalizedTerm = ngram.toLowerCase().trim();
//       if (!stopwords.includes(normalizedTerm)) {
//         if (termCounts[normalizedTerm]) {
//           termCounts[normalizedTerm] += 1;
//         } else {
//           termCounts[normalizedTerm] = 1;
//         }
//       }
//     });
//   });

//   const sortedTerms = Object.keys(termCounts)
//     .map((term) => ({ term, count: termCounts[term] }))
//     .sort((a, b) => b.count - a.count);

//   const primaryTerm = sortedTerms[0]?.term || 'No significant theme';

//   const relatedTerms = sortedTerms
//     .filter((item) => item.term.includes(primaryTerm))
//     .map((item) => item.term);

//   return new Response(
//     JSON.stringify({
//       primaryTerm,
//       relatedTerms,
//       sortedTerms,
//     }),
//     {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     }
//   );
// }

// // Helper function to generate n-grams
// function generateNGrams(terms: string[], maxN: number): string[] {
//   const nGrams: string[] = [];
//   for (let n = 1; n <= maxN; n++) {
//     for (let i = 0; i <= terms.length - n; i++) {
//       const nGram = terms.slice(i, i + n).join(' ');
//       nGrams.push(nGram);
//     }
//   }
//   return nGrams;
// }




// export async function POST(request: Request) {
//   const { responses } = await request.json();

//   if (!responses || !Array.isArray(responses)) {
//     return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
//   }

//   const termCounts: { [term: string]: number } = {};
//   const relatedTerms: Set<string> = new Set();
//   let totalTerms = 0;

//   responses.forEach((response: string) => {
//     const doc = nlp(response);

//     // Extract nouns, verbs, and adjectives using POS tagging
//     const nouns = doc.nouns().out('array');
//     const verbs = doc.verbs().out('array');
//     const adjectives = doc.adjectives().out('array');

//     // Combine all extracted terms
//     const extractedTerms = [...nouns, ...verbs, ...adjectives];

//     // Populate term counts and related terms
//     extractedTerms.forEach((term) => {
//       const normalizedTerm = term.toLowerCase();
//       termCounts[normalizedTerm] = (termCounts[normalizedTerm] || 0) + 1;
//       relatedTerms.add(normalizedTerm);
//     });

//     totalTerms += extractedTerms.length;
//   });

//   // Find the most common terms and calculate percentages
//   const sortedTerms = Object.keys(termCounts)
//     .map((term) => ({
//       term,
//       count: termCounts[term],
//       percentage: ((termCounts[term] / totalTerms) * 100).toFixed(2),
//     }))
//     .sort((a, b) => b.count - a.count);

//   const primaryTerm = sortedTerms[0]?.term || 'No significant theme';
//   const primaryPercentage = sortedTerms[0]?.percentage || '0.00';

//   // Generate a summary based on the primary term
//   const summary = sortedTerms.length
//     ? `${primaryTerm} was the most significant theme identified, constituting ${primaryPercentage}% of the total feedback.`
//     : 'No significant themes identified.';

//   return new Response(JSON.stringify({ summary, relatedTerms: sortedTerms }));
// }




const STOP_WORDS = new Set([
  'the', 'and', 'is', 'at', 'which', 'on', 'in', 'a', 'an', 'they', 'their', 'of', 'for',
  'to', 'with', 'that', 'this', 'as', 'are', 'by', 'be', 'has', 'had', 'were', 'was',
  // Add more stop words as needed
]);

export async function POST(request: Request) {
  const { responses } = await request.json();

  if (!responses || !Array.isArray(responses)) {
    return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
  }

  const termCounts: { [term: string]: number } = {};
  const relatedTerms: Set<string> = new Set();
  let totalTerms = 0;

  responses.forEach((response: string) => {
    const doc = nlp(response);

    // Extract nouns, verbs, and adjectives using POS tagging
    const nouns = doc.nouns().out('array');
    const verbs = doc.verbs().out('array');
    const adjectives = doc.adjectives().out('array');

    // Combine all extracted terms
    const extractedTerms = [...nouns, ...verbs, ...adjectives];

    // Remove stop words and populate term counts
    extractedTerms.forEach((term) => {
      const normalizedTerm = term.toLowerCase();
      if (!STOP_WORDS.has(normalizedTerm)) {
        termCounts[normalizedTerm] = (termCounts[normalizedTerm] || 0) + 1;
        relatedTerms.add(normalizedTerm);
      }
    });

    totalTerms += extractedTerms.length;
  });

  // Find the most common terms and calculate percentages
  const sortedTerms = Object.keys(termCounts)
    .map((term) => ({
      term,
      count: termCounts[term],
      percentage: ((termCounts[term] / totalTerms) * 100).toFixed(2),
    }))
    .sort((a, b) => b.count - a.count);

  // Generate a summary based on the primary term
  const primaryTerm = sortedTerms[0]?.term || 'No significant theme';
  const primaryPercentage = sortedTerms[0]?.percentage || '0.00';

  const summary = sortedTerms.length
    ? `${primaryTerm} was the most significant theme identified, constituting ${primaryPercentage}% of the total feedback.`
    : 'No significant themes identified.';

  return new Response(JSON.stringify({ summary, relatedTerms: sortedTerms }));
}


