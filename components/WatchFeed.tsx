import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface VideoContent {
  id: string;
  title: string;
  description: string;
  source: string;
  thumbnailUrl: string;
  videoUrl: string;
  videoId: string;
  duration: string;
  views: string;
  category: string;
  publishedAt: string;
  topic: string;
  subtopic: string;
  aiSummary?: string;
}

interface WatchFeedProps {
  refreshing?: boolean;
  onRefresh?: () => void;
}

export default function WatchFeed({ refreshing = false, onRefresh }: WatchFeedProps) {
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:3001/videos');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const videoData = await response.json();

      // Sort by creation date (newest first)
      const sortedVideos = videoData.sort((a: VideoContent, b: VideoContent) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );

      setVideos(sortedVideos);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError('Failed to load videos. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (onRefresh) {
      onRefresh();
    } else {
      await fetchVideos();
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  }).current;

  const handleVideoPress = (video: VideoContent) => {
    // Open YouTube video
    Alert.alert(
      video.title,
      'This would open the video in YouTube or a video player',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Watch', onPress: () => console.log('Opening video:', video.videoUrl) },
      ]
    );
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
  };

  const renderVideoItem = ({ item, index }: { item: VideoContent; index: number }) => {
    const isActive = index === currentIndex;

    return (
      <View style={styles.videoContainer}>
        {/* Video Thumbnail */}
        <TouchableOpacity
          style={styles.videoPlayer}
          onPress={() => handleVideoPress(item)}
          activeOpacity={0.9}
        >
          <Image
            source={{ uri: item.thumbnailUrl || 'https://via.placeholder.com/400x600?text=Video' }}
            style={styles.videoThumbnail}
            resizeMode="cover"
          />

          {/* Play Button Overlay */}
          <View style={styles.playButton}>
            <Text style={styles.playIcon}>▶️</Text>
          </View>

          {/* Duration Badge */}
          {item.duration && item.duration !== "0:00" && (
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{item.duration}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Video Info Overlay */}
        <View style={styles.videoOverlay}>
          <View style={styles.videoInfo}>
            <Text style={styles.videoTitle} numberOfLines={2}>
              {item.title}
            </Text>

            <Text style={styles.videoDescription} numberOfLines={3}>
              {item.aiSummary || item.description}
            </Text>

            <View style={styles.videoMeta}>
              <Text style={styles.videoSource}>{item.source}</Text>
              <Text style={styles.videoCategory}>{item.category}</Text>
              {item.views && item.views !== "0" && (
                <Text style={styles.videoViews}>{item.views} views</Text>
              )}
              <Text style={styles.videoTime}>{formatTimeAgo(item.publishedAt)}</Text>
            </View>

            <TouchableOpacity style={styles.topicTag}>
              <Text style={styles.topicText}>{item.subtopic}</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>❤️</Text>
              <Text style={styles.actionLabel}>Like</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>💬</Text>
              <Text style={styles.actionLabel}>Comment</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📤</Text>
              <Text style={styles.actionLabel}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>🔖</Text>
              <Text style={styles.actionLabel}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: isActive ? '45%' : '0%' }]} />
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading videos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchVideos}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (videos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No videos available</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchVideos}>
          <Text style={styles.retryButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={videos}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        getItemLayout={(data, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
        removeClippedSubviews={true}
        maxToRenderPerBatch={3}
        windowSize={5}
        initialNumToRender={2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 24,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  videoContainer: {
    width: width,
    height: height,
    position: 'relative',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a1a',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 24,
    color: '#fff',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  videoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 32,
    backgroundColor: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
  },
  videoInfo: {
    flex: 1,
    marginRight: 16,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    lineHeight: 20,
  },
  videoDescription: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 18,
    marginBottom: 12,
  },
  videoMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    alignItems: 'center',
  },
  videoSource: {
    fontSize: 12,
    color: '#4caf50',
    fontWeight: '500',
    marginRight: 12,
  },
  videoCategory: {
    fontSize: 12,
    color: '#2196f3',
    fontWeight: '500',
    marginRight: 12,
  },
  videoViews: {
    fontSize: 12,
    color: '#ccc',
    marginRight: 12,
  },
  videoTime: {
    fontSize: 12,
    color: '#ccc',
  },
  topicTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(33,150,243,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  topicText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '500',
  },
  actionButtons: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 24,
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  actionLabel: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '500',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  progressBar: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  progress: {
    height: '100%',
    backgroundColor: '#fff',
  },
});