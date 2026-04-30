'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';
import Image from 'next/image';

interface InstagramPost {
  id: string;
  imageUrl: string;
  postUrl: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function InstagramGalleryPage() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    imageUrl: '',
    postUrl: '',
    order: 0,
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get<any>('/api/instagram-gallery');
      setPosts(response.data || []);
    } catch (error) {
      const errorMessage = error instanceof ApiError
        ? error.message
        : 'Failed to load Instagram posts';
      toast.error('Error', { description: errorMessage });
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.imageUrl || !formData.postUrl) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/api/instagram-gallery', formData, true);
      toast.success('Instagram post added successfully');
      setFormData({ imageUrl: '', postUrl: '', order: 0 });
      fetchPosts();
    } catch (error) {
      const errorMessage = error instanceof ApiError
        ? error.message
        : 'Failed to add Instagram post';
      toast.error('Error', { description: errorMessage });
      console.error('Error adding post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Instagram post?')) {
      return;
    }

    try {
      await api.delete(`/api/instagram-gallery/${id}`, true);
      toast.success('Instagram post deleted successfully');
      fetchPosts();
    } catch (error) {
      const errorMessage = error instanceof ApiError
        ? error.message
        : 'Failed to delete Instagram post';
      toast.error('Error', { description: errorMessage });
      console.error('Error deleting post:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton count={1} height="h-12" className="w-64" />
        <LoadingSkeleton count={3} height="h-32" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Instagram Gallery</h1>
        <p className="text-muted-foreground mt-2">
          Manage Instagram posts displayed on homepage
        </p>
      </div>

      {/* Add New Post Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Instagram Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL *</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Upload image to Cloudinary or use direct URL
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="postUrl">Instagram Post URL *</Label>
                <Input
                  id="postUrl"
                  type="url"
                  placeholder="https://www.instagram.com/p/ABC123/"
                  value={formData.postUrl}
                  onChange={(e) => setFormData({ ...formData, postUrl: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Copy link from Instagram post
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Display Order (Optional)</Label>
              <Input
                id="order"
                type="number"
                min="0"
                placeholder="0"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              />
              <p className="text-xs text-muted-foreground">
                Lower numbers appear first (0 = first position)
              </p>
            </div>

            <Button type="submit" disabled={isSubmitting}>
              <Plus className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Adding...' : 'Add Post'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Posts List */}
      <Card>
        <CardHeader>
          <CardTitle>Current Instagram Posts ({posts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <EmptyState
              icon={Plus}
              title="No Instagram posts"
              description="Add your first Instagram post to display on homepage"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map((post) => (
                <div key={post.id} className="border rounded-lg overflow-hidden">
                  <div className="relative aspect-square">
                    <Image
                      src={post.imageUrl}
                      alt="Instagram post"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Order: {post.order}
                      </span>
                      <a
                        href={post.postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        View Post
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
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
