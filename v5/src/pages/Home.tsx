import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  FileCode, 
  BarChart2, 
  Settings, 
  ArrowRight, 
  MessageSquare, 
  Star, 
  CheckCircle, 
  Globe, 
  Search,
  ShoppingCart,
  Clock,
  Zap,
  Users,
  ArrowUpRight
} from 'lucide-react';

const Home = () => {
  // Platform advantages
  const advantages = [
    {
      icon: <FileCode className="h-6 w-6 text-indigo-600" />,
      title: "AI-Powered Content",
      description: "Our advanced AI analyzes top-performing content to generate high-converting copy."
    },
    {
      icon: <Search className="h-6 w-6 text-indigo-600" />,
      title: "SEO Optimized",
      description: "Built-in keyword research and optimization tools ensure your content ranks higher."
    },
    {
      icon: <Clock className="h-6 w-6 text-indigo-600" />,
      title: "Time Saving",
      description: "Generate complete, ready-to-publish content in minutes instead of hours."
    },
    {
      icon: <BarChart2 className="h-6 w-6 text-indigo-600" />,
      title: "Increased Conversions",
      description: "Compelling content that drives engagement and boosts conversion rates."
    },
    {
      icon: <Zap className="h-6 w-6 text-indigo-600" />,
      title: "Lightning Fast",
      description: "Generate high-quality content with just a few clicks in seconds."
    },
    {
      icon: <Users className="h-6 w-6 text-indigo-600" />,
      title: "Team Collaboration",
      description: "Easy sharing and collaboration features for your entire team."
    }
  ];

  // How it works steps
  const howItWorksSteps = [
    {
      number: "01",
      title: "Create an account",
      description: "Sign up for free and get immediate access to all features."
    },
    {
      number: "02",
      title: "Add your API key",
      description: "Enter your Perplexity API key to enable AI generation."
    },
    {
      number: "03",
      title: "Generate content",
      description: "Enter your topic and let our AI create optimized content."
    }
  ];

  // Simplified to a single free plan
  const freePlan = {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Full access with your own API key",
    features: [
      "Unlimited content generations",
      "Advanced SEO optimization",
      "All templates and features",
      "Export in multiple formats",
      "Just add your own Perplexity API key"
    ],
    buttonText: "Get Started",
    buttonVariant: "default"
  };

  // FAQ items
  const faqItems = [
    {
      question: "What is Content Generator Pro?",
      answer: "Content Generator Pro is an AI-powered writing tool that helps you create SEO-optimized content for blogs, articles, product descriptions, and more with minimal input."
    },
    {
      question: "Is it really free to use?",
      answer: "Yes! Our tool is completely free to use. You only need to provide your own Perplexity API key."
    },
    {
      question: "How do I get a Perplexity API key?",
      answer: "You can obtain a Perplexity API key by signing up at the Perplexity website. We don't sell or provide API keys."
    },
    {
      question: "Can I customize the output format?",
      answer: "Yes, you can customize the tone, style, length, and format of the generated content to match your specific requirements and brand voice."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take data security seriously. All your data is encrypted and stored securely. We do not share or sell your information to third parties."
    },
    {
      question: "Can I use the generated content commercially?",
      answer: "Yes, all content generated through our platform belongs to you and can be used for commercial purposes without any restrictions."
    }
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "This tool has transformed our content creation process. We're producing more engaging articles in half the time.",
      author: "Sarah Johnson",
      role: "Marketing Director"
    },
    {
      quote: "The SEO optimization feature alone is worth it. Our organic traffic increased by 40% in just two months.",
      author: "Michael Chen",
      role: "Content Strategist"
    },
    {
      quote: "I used to spend hours writing product descriptions. Now I can create dozens in minutes with perfect consistency.",
      author: "James Patterson",
      role: "E-commerce Manager"
    },
    {
      quote: "As a small business owner, this tool has allowed me to compete with bigger brands by consistently publishing quality content.",
      author: "Emma Rodriguez",
      role: "Founder & CEO"
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 sm:pb-24 bg-gradient-to-b from-slate-900 to-indigo-900 text-white">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-500/20 rounded-full filter blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-500/20 rounded-full filter blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
          <div className="absolute top-1/2 left-1/2 w-1/3 h-1/3 bg-purple-500/20 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Hero Text */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                AI Writing Tool for{" "}
                <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                  Generating
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
                A simple but powerful way to create SEO-optimized content, from blog posts to product descriptions, in just seconds using advanced AI technology.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/generator">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 w-full sm:w-auto"
                  >
                    Get Started for Free
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto">
                  Watch Demo
                </Button>
              </div>
              
              <div className="mt-8 text-sm text-gray-400">
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((_, i) => (
                      <div key={i} className={`w-8 h-8 rounded-full border-2 border-slate-800 bg-gradient-to-br ${
                        ['from-blue-500 to-blue-700', 'from-indigo-500 to-indigo-700', 'from-purple-500 to-purple-700', 'from-cyan-500 to-cyan-700'][i]
                      }`}></div>
                    ))}
                  </div>
                  <span>Trusted by <span className="font-semibold text-white">15,000+</span> content creators</span>
                </div>
              </div>
            </div>
            
            {/* Hero Image - Fixed with static image */}
            <div className="lg:w-1/2 relative">
              <div className="relative mx-auto max-w-md">
                <div className="relative z-20 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
                  <div className="bg-gray-100 p-3 border-b border-gray-200 flex items-center">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="mx-auto text-sm font-medium text-gray-500">Content Generator Pro</div>
                  </div>
                  
                  {/* Replace placeholder with static image */}
                  <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center">
                    <FileCode className="h-16 w-16 text-gray-400" />
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-4 -right-4 z-10 w-24 h-24 bg-blue-500/20 rounded-lg backdrop-blur-xl transform rotate-12"></div>
                <div className="absolute -bottom-4 -left-4 z-10 w-32 h-32 bg-indigo-500/20 rounded-lg backdrop-blur-xl transform -rotate-12"></div>
                <div className="absolute bottom-12 right-12 z-30 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-indigo-600 text-lg font-bold">10x</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User-friendly Solution Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">User-friendly solution to generate content</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform combines powerful AI with an intuitive interface to make content creation faster, easier, and more effective than ever before.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
                  {advantage.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{advantage.title}</h3>
                <p className="text-gray-600">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Easy Is Our Platform Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Platform Screenshot - Fixed with static content */}
            <div className="lg:w-1/2 relative order-2 lg:order-1">
              <div className="relative mx-auto max-w-lg">
                {/* Main image */}
                <div className="relative z-20 bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
                  <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center">
                    <div className="w-3/4">
                      <div className="h-8 w-full bg-indigo-100 rounded-md mb-4"></div>
                      <div className="h-4 w-3/4 bg-gray-200 rounded-md mb-2"></div>
                      <div className="h-4 w-1/2 bg-gray-200 rounded-md mb-4"></div>
                      <div className="h-10 w-full bg-indigo-100 rounded-md mb-4"></div>
                      <div className="h-32 w-full bg-gray-200 rounded-md"></div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-6 -left-6 z-10 w-24 h-24 bg-indigo-100 rounded-lg transform rotate-6"></div>
                <div className="absolute -bottom-6 -right-6 z-10 w-24 h-24 bg-blue-100 rounded-lg transform -rotate-6"></div>
              </div>
            </div>
            
            {/* Text content */}
            <div className="lg:w-1/2 order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">How easy is our platform to use?</h2>
              
              <div className="space-y-8">
                {howItWorksSteps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <Link to="/generator">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    Try It Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Wait To Take Advantage Section */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Why wait to take advantage?</h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-3xl mx-auto">
            Join thousands of marketers, bloggers, and business owners who are already saving time and creating better content.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              ⭐ Enterprise-grade quality
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              ⚡ Fastest processing times
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              🔒 Enhanced privacy
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              💯 100% original content
            </div>
          </div>
          
          <Link to="/generator">
            <Button 
              size="lg" 
              className="bg-white text-indigo-600 hover:bg-gray-100"
            >
              Start Creating Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Generate AI-powered Content Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Text content */}
            <div className="lg:w-2/5">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Generate AI-powered content <span className="text-indigo-600">in 1 click.</span>
              </h2>
              
              <p className="text-lg text-gray-600 mb-6">
                Just input your topic, select your preferences, and our AI will generate high-quality, engaging content ready for publication in seconds.
              </p>
              
              <ul className="space-y-3 mb-8">
                {['Fully optimized for SEO', 'Engaging and readable', 'Fact-checked information', 'Unique and plagiarism-free'].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              
              <Link to="/generator">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Try It Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            {/* Image - Fixed with static content */}
            <div className="lg:w-3/5">
              <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl mx-auto">
                <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center">
                  <div className="w-4/5 space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-indigo-200 rounded-lg flex items-center justify-center">
                        <FileCode className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="h-8 w-48 bg-indigo-100 rounded-md"></div>
                    </div>
                    <div className="h-4 w-full bg-gray-200 rounded-md"></div>
                    <div className="h-4 w-5/6 bg-gray-200 rounded-md"></div>
                    <div className="h-4 w-4/6 bg-gray-200 rounded-md"></div>
                    <div className="h-32 w-full bg-gray-200 rounded-md"></div>
                    <div className="flex justify-end">
                      <div className="h-10 w-32 bg-indigo-200 rounded-md"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Tool Section */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Image - Fixed with static content */}
            <div className="lg:w-3/5 order-2 lg:order-1">
              <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl mx-auto">
                <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center">
                  <div className="w-4/5 space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-amber-200 rounded-lg flex items-center justify-center">
                        <Search className="h-6 w-6 text-amber-600" />
                      </div>
                      <div className="h-8 w-48 bg-amber-100 rounded-md"></div>
                    </div>
                    <div className="h-4 w-full bg-gray-200 rounded-md"></div>
                    <div className="h-4 w-5/6 bg-gray-200 rounded-md"></div>
                    <div className="h-4 w-4/6 bg-gray-200 rounded-md"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-24 w-full bg-gray-200 rounded-md"></div>
                      <div className="h-24 w-full bg-gray-200 rounded-md"></div>
                    </div>
                    <div className="h-24 w-full bg-gray-200 rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Text content */}
            <div className="lg:w-2/5 order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                SEO tool to optimize your content for <span className="text-amber-600">first page rankings</span>
              </h2>
              
              <p className="text-lg text-gray-600 mb-6">
                Our built-in SEO tools analyze top-ranking content and provide recommendations to optimize your content for maximum search visibility.
              </p>
              
              <ul className="space-y-3 mb-8">
                {['Keyword density analysis', 'SERP preview', 'Readability score', 'On-page SEO suggestions'].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              
              <Link to="/generator">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                  Optimize Your Content <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Amazon Product List Section */}
      <section className="py-16 bg-red-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Text content */}
            <div className="lg:w-2/5">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Adding Amazon <span className="text-red-600">product list</span>
              </h2>
              
              <p className="text-lg text-gray-600 mb-6">
                Easily integrate Amazon products into your content with our specialized tool that formats and optimizes product showcases for maximum conversions.
              </p>
              
              <ul className="space-y-3 mb-8">
                {['Beautiful product displays', 'Automatic affiliate link integration', 'Conversion-optimized layouts', 'Mobile-responsive design'].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              
              <Link to="/generator">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  Create Product Lists <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            {/* Image - Fixed with static content */}
            <div className="lg:w-3/5">
              <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl mx-auto">
                <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center">
                  <div className="w-4/5 space-y-4">
                    <div className="h-8 w-2/3 bg-red-100 rounded-md mx-auto mb-6"></div>
                    <div className="flex gap-4">
                      <div className="w-1/3 h-48 bg-gray-200 rounded-md"></div>
                      <div className="w-2/3 space-y-3">
                        <div className="h-6 w-full bg-gray-300 rounded-md"></div>
                        <div className="h-4 w-2/3 bg-gray-200 rounded-md"></div>
                        <div className="h-4 w-1/2 bg-gray-200 rounded-md"></div>
                        <div className="h-6 w-1/3 bg-red-200 rounded-md"></div>
                        <div className="h-10 w-1/2 bg-red-300 rounded-md"></div>
                      </div>
                    </div>
                    <div className="h-1 w-full bg-gray-200 my-4"></div>
                    <div className="flex gap-4">
                      <div className="w-1/3 h-24 bg-gray-200 rounded-md"></div>
                      <div className="w-2/3 space-y-2">
                        <div className="h-5 w-full bg-gray-300 rounded-md"></div>
                        <div className="h-4 w-2/3 bg-gray-200 rounded-md"></div>
                        <div className="h-6 w-1/3 bg-red-200 rounded-md"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">See the magic of writing come to life!</h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Don't just take our word for it. See what our users have to say about their experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-gray-800 p-6 rounded-xl border border-gray-700"
              >
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 italic mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-white">{testimonial.author}</p>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Modified to show only one free plan */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Start Your Free Plan Today!</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our tool is completely free to use. Just add your own API key.
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="border rounded-xl overflow-hidden bg-white transition-all duration-300 shadow-lg border-indigo-200 transform hover:scale-105">
              <div className="bg-indigo-600 text-white text-center py-1 text-sm font-medium">
                Forever Free
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{freePlan.name}</h3>
                <div className="flex items-end gap-1 mb-4">
                  <span className="text-3xl font-bold text-gray-900">{freePlan.price}</span>
                  <span className="text-gray-600 mb-1">{freePlan.period}</span>
                </div>
                <p className="text-gray-600 mb-6">{freePlan.description}</p>
                
                <ul className="space-y-3 mb-6">
                  {freePlan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to="/generator">
                  <Button 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Questions & Answers</h2>
            <p className="text-lg text-gray-600">
              Find answers to the most common questions about our platform.
            </p>
          </div>
          
          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.question}</h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative py-16 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to transform your content?</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of content creators who are saving time and creating better content with our AI-powered tools.
          </p>
          <Link to="/generator">
            <Button 
              size="lg" 
              className="bg-white text-indigo-600 hover:bg-gray-100 text-lg px-8"
            >
              Start Creating Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;