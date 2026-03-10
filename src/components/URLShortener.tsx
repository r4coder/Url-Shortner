"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Trash2, ExternalLink, Link as LinkIcon, ArrowUpDown, Sparkles, LogOut } from "lucide-react";
import { toast } from "sonner";
import { authClient, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface URLData {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: string;
  clicks: number;
}

type SortOption = "newest" | "oldest" | "mostClicks" | "leastClicks";

export default function URLShortener() {
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();
  const [urls, setUrls] = useState<URLData[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  // Validate token on mount
  useEffect(() => {
    const token = localStorage.getItem("bearer_token");
    if (!token || token === "null" || token === "undefined") {
      console.error("Invalid or missing bearer token, redirecting to login");
      localStorage.removeItem("bearer_token");
      router.push("/login");
    }
  }, [router]);

  // Fetch URLs
  const fetchUrls = async () => {
    if (!session?.user) return;
    
    try {
      const token = localStorage.getItem("bearer_token");
      
      if (!token || token === "null" || token === "undefined") {
        toast.error("Session expired. Please sign in again.");
        router.push("/login");
        return;
      }

      const response = await fetch(`/api/urls`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.status === 401) {
        toast.error("Session expired. Please sign in again.");
        localStorage.removeItem("bearer_token");
        router.push("/login");
        return;
      }

      const data = await response.json();
      setUrls(Array.isArray(data.urls) ? data.urls : []);
    } catch (error) {
      toast.error("Failed to fetch URLs");
      setUrls([]);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchUrls();
    }
  }, [session]);

  // Create short URL
  const handleCreateUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUrl.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    if (!session?.user) {
      toast.error("Please login to create URLs");
      return;
    }

    const token = localStorage.getItem("bearer_token");
    
    if (!token || token === "null" || token === "undefined") {
      toast.error("Session expired. Please sign in again.");
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/urls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          originalUrl: newUrl
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        toast.error("Session expired. Please sign in again.");
        localStorage.removeItem("bearer_token");
        router.push("/login");
        return;
      }

      if (!response.ok) {
        toast.error(data.error || "Failed to create short URL");
        return;
      }

      setUrls([data.url, ...(Array.isArray(urls) ? urls : [])]);
      setNewUrl("");
      toast.success("Short URL created successfully!");
    } catch (error) {
      console.error("Create URL error:", error);
      toast.error("Failed to create short URL");
    } finally {
      setLoading(false);
    }
  };

  // Delete URL
  const handleDeleteUrl = async (id: string) => {
    if (!session?.user) return;
    
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/urls?id=${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        toast.error("Failed to delete URL");
        return;
      }

      setUrls((Array.isArray(urls) ? urls : []).filter(url => url.id !== id));
      toast.success("URL deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete URL");
    }
  };

  // Copy to clipboard
  const handleCopyUrl = (shortCode: string) => {
    const shortUrl = `${window.location.origin}/api/r/${shortCode}`;
    navigator.clipboard.writeText(shortUrl);
    toast.success("Short URL copied to clipboard!");
  };

  // Sign out
  const handleSignOut = async () => {
    const token = localStorage.getItem("bearer_token");
    const { error } = await authClient.signOut({
      fetchOptions: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
    
    if (error?.code) {
      toast.error(error.code);
    } else {
      localStorage.removeItem("bearer_token");
      refetch();
      router.push("/login");
    }
  };

  // Sort URLs
  const sortedUrls = [...(Array.isArray(urls) ? urls : [])].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "mostClicks":
        return b.clicks - a.clicks;
      case "leastClicks":
        return a.clicks - b.clicks;
      default:
        return 0;
    }
  });

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 border-3 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10">
      {/* Premium Header */}
      <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 backdrop-blur-xl border border-white/20 shadow-lg">
          <Sparkles className="h-4 w-4 text-violet-500 animate-pulse" />
          <span className="text-sm font-medium bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
            Premium URL Shortener
          </span>
        </div>
        <h1 className="text-6xl md:text-7xl font-bold tracking-tight bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
          Shorten with Style
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Transform your links into elegant, memorable URLs with our premium shortening service
        </p>
        
        {/* User info and sign out */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <span className="text-sm text-muted-foreground">
            Welcome, <span className="font-semibold text-foreground">{session.user.name || session.user.email}</span>
          </span>
          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className="bg-black hover:bg-gray-800 text-white border-black"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Create URL Form - Glassmorphic */}
      <Card className="backdrop-blur-2xl bg-white/40 dark:bg-black/40 border-white/20 shadow-2xl shadow-purple-500/10 animate-in fade-in slide-in-from-bottom-8 duration-1000 [animation-delay:200ms] hover:shadow-purple-500/20 transition-all duration-500">
        <CardHeader className="space-y-2">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 rounded-xl bg-black shadow-lg">
              <LinkIcon className="h-5 w-5 text-white" />
            </div>
            Create Short URL
          </CardTitle>
          <CardDescription className="text-base">
            Enter a long URL to create a shortened, shareable version
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateUrl} className="flex gap-3">
            <Input
              type="url"
              placeholder="https://example.com/very-long-url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="flex-1 h-12 backdrop-blur-xl bg-white/50 dark:bg-black/50 border-white/30 focus:border-black focus:ring-black transition-all duration-300"
              disabled={loading}
            />
            <Button 
              type="submit" 
              disabled={loading}
              className="h-12 px-8 bg-black hover:bg-gray-800 text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </span>
              ) : (
                "Shorten"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* URL List - Glassmorphic */}
      <Card className="backdrop-blur-2xl bg-white/40 dark:bg-black/40 border-white/20 shadow-2xl shadow-purple-500/10 animate-in fade-in slide-in-from-bottom-8 duration-1000 [animation-delay:400ms]">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl">Your URLs</CardTitle>
              <CardDescription className="text-base">
                Manage and track your shortened URLs
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="w-[160px] backdrop-blur-xl bg-white/50 dark:bg-black/50 border-white/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="backdrop-blur-2xl bg-white/90 dark:bg-black/90 border-white/20">
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="mostClicks">Most Clicks</SelectItem>
                  <SelectItem value="leastClicks">Least Clicks</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {fetching ? (
            <div className="text-center py-12 text-muted-foreground">
              <div className="inline-flex items-center gap-3">
                <div className="h-6 w-6 border-3 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                <span className="text-lg">Loading URLs...</span>
              </div>
            </div>
          ) : sortedUrls.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <LinkIcon className="h-8 w-8 text-gray-600 dark:text-gray-400" />
              </div>
              <p className="text-muted-foreground text-lg">
                No URLs yet. Create your first short URL above!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedUrls.map((url, index) => (
                <div
                  key={url.id}
                  className="group relative overflow-hidden rounded-xl backdrop-blur-xl bg-white/50 dark:bg-black/50 border border-white/30 shadow-lg hover:shadow-xl hover:border-gray-400 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative flex items-center justify-between p-5">
                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <code className="text-sm font-mono font-semibold px-3 py-1.5 rounded-lg bg-black/10 dark:bg-white/10 border border-white/30 backdrop-blur-xl">
                          /api/r/{url.shortCode}
                        </code>
                        <Badge 
                          variant="secondary" 
                          className="px-3 py-1 bg-black/10 dark:bg-white/10 border-white/30 backdrop-blur-xl font-semibold"
                        >
                          <span className="inline-block w-2 h-2 rounded-full bg-gray-600 dark:bg-gray-400 mr-2 animate-pulse" />
                          {url.clicks} clicks
                        </Badge>
                      </div>
                      <a
                        href={url.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-black dark:hover:text-white truncate block transition-colors duration-300 font-medium"
                      >
                        {url.originalUrl}
                      </a>
                      <p className="text-xs text-muted-foreground/80 font-medium">
                        Created {new Date(url.createdAt).toLocaleDateString(undefined, { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleCopyUrl(url.shortCode)}
                        title="Copy short URL"
                        className="backdrop-blur-xl bg-white hover:bg-black hover:text-white border-gray-300 hover:border-black hover:scale-110 transition-all duration-300 shadow-lg"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                        className="backdrop-blur-xl bg-white hover:bg-black hover:text-white border-gray-300 hover:border-black hover:scale-110 transition-all duration-300 shadow-lg"
                      >
                        <a
                          href={`/api/r/${url.shortCode}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open short URL"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteUrl(url.id)}
                        title="Delete URL"
                        className="backdrop-blur-xl bg-white hover:bg-black hover:text-white border-gray-300 hover:border-black hover:scale-110 transition-all duration-300 shadow-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}