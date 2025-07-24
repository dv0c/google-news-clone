export const mockNewsData = {
  "top-stories": [
    {
      id: 1,
      headline: "Καύσωνας διαρκείας προ των πυλών: Πού θα χτυπήσει «κόκκινο» – Οι πιο ζεστές μέρες",
      summary:
        "World leaders agree on ambitious new targets for carbon reduction in landmark climate deal that could reshape global energy policy.",
      source: "Reuters",
      timestamp: "2 hours ago",
      image: "https://www.ertnews.gr/wp-content/uploads/2025/07/kafsonas3-768x512-1.jpg",
      relatedNews: [
        {
          id: 11,
          headline: "Environmental Groups Praise New Climate Deal",
          source: "BBC News",
          timestamp: "1 hour ago",
        },
        {
          id: 12,
          headline: "Economic Impact of Climate Agreement Analyzed",
          source: "Financial Times",
          timestamp: "3 hours ago",
        },
      ],
    },
    {
      id: 2,
      headline: "Tech Giants Report Strong Q4 Earnings",
      summary:
        "Major technology companies exceed expectations with robust quarterly results driven by AI investments and cloud services growth.",
      source: "Bloomberg",
      timestamp: "4 hours ago",
      image: "/placeholder.svg?height=200&width=300",
      relatedNews: [
        {
          id: 21,
          headline: "AI Investment Drives Tech Stock Rally",
          source: "TechCrunch",
          timestamp: "2 hours ago",
        },
        {
          id: 22,
          headline: "Cloud Services Show Unprecedented Growth",
          source: "Wired",
          timestamp: "5 hours ago",
        },
      ],
    },
    {
      id: 3,
      headline: "Global Markets Rally on Economic Data",
      summary:
        "Stock markets worldwide surge following positive employment figures and inflation data suggesting economic stability.",
      source: "Financial Times",
      timestamp: "6 hours ago",
      image: "/placeholder.svg?height=200&width=300",
      relatedNews: [
        {
          id: 31,
          headline: "Employment Figures Beat Expectations",
          source: "Wall Street Journal",
          timestamp: "4 hours ago",
        },
      ],
    },
  ],
  world: [
    {
      id: 4,
      headline: "International Trade Agreement Signed",
      summary:
        "New multilateral trade deal promises to boost economic cooperation between major economies and reduce tariff barriers.",
      source: "Associated Press",
      timestamp: "1 hour ago",
      image: "/placeholder.svg?height=200&width=300",
      relatedNews: [],
    },
    {
      id: 5,
      headline: "Humanitarian Aid Reaches Crisis Region",
      summary:
        "International relief organizations successfully deliver essential supplies to areas affected by recent natural disasters.",
      source: "BBC News",
      timestamp: "3 hours ago",
      image: "/placeholder.svg?height=200&width=300",
      relatedNews: [],
    },
  ],
  business: [
    {
      id: 6,
      headline: "Startup Raises $500M in Series C Funding",
      summary:
        "AI-powered logistics company secures major investment round led by prominent venture capital firms for global expansion.",
      source: "TechCrunch",
      timestamp: "30 minutes ago",
      image: "/placeholder.svg?height=200&width=300",
      relatedNews: [],
    },
    {
      id: 7,
      headline: "Retail Sales Show Unexpected Growth",
      summary:
        "Consumer spending increases across multiple sectors, indicating stronger economic confidence than previously forecasted.",
      source: "Wall Street Journal",
      timestamp: "2 hours ago",
      image: "/placeholder.svg?height=200&width=300",
      relatedNews: [],
    },
  ],
  technology: [
    {
      id: 8,
      headline: "New AI Model Achieves Breakthrough Performance",
      summary:
        "Researchers unveil advanced artificial intelligence system that demonstrates significant improvements in reasoning and problem-solving.",
      source: "MIT Technology Review",
      timestamp: "1 hour ago",
      image: "/placeholder.svg?height=200&width=300",
      relatedNews: [],
    },
    {
      id: 9,
      headline: "Quantum Computing Milestone Reached",
      summary:
        "Scientists achieve new quantum computing record, bringing practical quantum applications closer to reality.",
      source: "Nature",
      timestamp: "5 hours ago",
      image: "/placeholder.svg?height=200&width=300",
      relatedNews: [],
    },
  ],
}

export const mockFullArticles = {
  1: {
    id: 1,
    headline: "Major Climate Summit Reaches Historic Agreement",
    summary:
      "World leaders agree on ambitious new targets for carbon reduction in landmark climate deal that could reshape global energy policy.",
    content: `
      <p>In a groundbreaking development that could reshape global environmental policy, world leaders at the International Climate Summit have reached a historic agreement on ambitious new targets for carbon reduction.</p>
      
      <p>The comprehensive deal, negotiated over five intensive days of discussions, commits participating nations to achieving net-zero carbon emissions by 2040 - a decade earlier than previous international agreements.</p>
      
      <p>"This agreement represents a turning point in our collective fight against climate change," said Dr. Sarah Chen, lead climate negotiator. "For the first time, we have binding commitments that align with the scientific consensus on what's needed to limit global warming to 1.5 degrees Celsius."</p>
      
      <p>Key provisions of the agreement include:</p>
      <ul>
        <li>Mandatory 50% reduction in carbon emissions by 2030</li>
        <li>$500 billion global fund for renewable energy infrastructure</li>
        <li>Phase-out of coal power plants by 2035</li>
        <li>Enhanced support for developing nations' green transition</li>
      </ul>
      
      <p>The deal has been praised by environmental groups worldwide, though some critics argue the timeline may be too ambitious for certain developing economies.</p>
      
      <p>Implementation will begin immediately, with quarterly progress reviews and potential penalties for non-compliance. The agreement is expected to accelerate investment in clean energy technologies and create millions of green jobs globally.</p>
    `,
    source: "Reuters",
    timestamp: "2 hours ago",
    author: "Michael Rodriguez",
    image: "/placeholder.svg?height=400&width=800&text=Climate+Summit",
    readTime: "4 min read",
  },
  2: {
    id: 2,
    headline: "Tech Giants Report Strong Q4 Earnings",
    summary:
      "Major technology companies exceed expectations with robust quarterly results driven by AI investments and cloud services growth.",
    content: `
      <p>Major technology companies have delivered exceptional fourth-quarter earnings results, significantly exceeding analyst expectations and demonstrating the robust growth potential of artificial intelligence and cloud computing sectors.</p>
      
      <p>The standout performers include several industry leaders who reported double-digit revenue growth, driven primarily by increased enterprise adoption of AI tools and expanding cloud infrastructure services.</p>
      
      <p>"We're witnessing a fundamental shift in how businesses operate, with AI becoming integral to operations across all sectors," said Jennifer Walsh, senior technology analyst at Market Insights.</p>
      
      <p>Key highlights from the earnings reports:</p>
      <ul>
        <li>Cloud services revenue up 35% year-over-year</li>
        <li>AI-related products contributing $12 billion in quarterly revenue</li>
        <li>Enterprise software subscriptions growing at 28% annually</li>
        <li>Mobile and consumer hardware showing steady recovery</li>
      </ul>
      
      <p>The strong performance has led to upgraded forecasts for the technology sector, with many companies raising their guidance for the upcoming fiscal year.</p>
      
      <p>Investors have responded positively, with tech stocks rallying in after-hours trading. The results suggest that concerns about economic headwinds may have been overblown, at least for the technology sector.</p>
    `,
    source: "Bloomberg",
    timestamp: "4 hours ago",
    author: "David Kim",
    image: "/placeholder.svg?height=400&width=800&text=Tech+Earnings",
    readTime: "3 min read",
  },
}
