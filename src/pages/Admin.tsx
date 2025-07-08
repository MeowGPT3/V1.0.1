import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts, Product, Flavor } from "@/contexts/ProductContext";
import { useOrders } from "@/contexts/OrderContext";
import {
  Shield,
  Plus,
  Trash2,
  Edit,
  Package,
  Tag,
  Users,
  ShoppingBag,
  Settings,
  Save,
  X,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  BarChart3,
  Globe,
  Palette,
  Bell,
  Database,
  Key,
  UserCheck,
  CreditCard,
  Upload,
  RefreshCw,
  Check,
  Clock,
  Truck,
  AlertCircle,
  CheckCircle,
  Zap,
  FileText,
  Image,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  orders: number;
  totalSpent: number;
  status: "active" | "inactive" | "banned";
  avatar: string;
  lastLogin: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences?: {
    newsletter: boolean;
    promotions: boolean;
    orderUpdates: boolean;
  };
}

interface OrderWithTracking {
  id: string;
  trackingId: string;
  status:
    | "processing"
    | "shipped"
    | "out-for-delivery"
    | "delivered"
    | "cancelled";
  orderDate: Date;
  estimatedDelivery: Date;
  actualDelivery?: Date;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  totalAmount: number;
  paymentMethod: string;
  couponApplied?: {
    code: string;
    discount: number;
  };
  trackingUpdates: Array<{
    date: Date;
    status: string;
    location: string;
    description: string;
  }>;
}

interface Settings {
  general: {
    siteName: string;
    logo: string;
    favicon: string;
    theme: "light" | "dark" | "auto";
    language: string;
    timezone: string;
    maintenanceMode: boolean;
    welcomeMessage: string;
  };
  payments: {
    stripe: { enabled: boolean; publicKey: string; secretKey: string };
    razorpay: { enabled: boolean; keyId: string; keySecret: string };
    paypal: { enabled: boolean; clientId: string; clientSecret: string };
    currency: string;
    enableCoupons: boolean;
    taxRate: number;
    refundPolicy: string;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    senderName: string;
    senderEmail: string;
    templates: {
      welcome: string;
      passwordReset: string;
      orderConfirmation: string;
    };
  };
  notifications: {
    systemNotifications: boolean;
    emailNotifications: boolean;
    userSignupAlert: boolean;
    orderPlacedAlert: boolean;
    pushNotifications: boolean;
  };
  analytics: {
    googleAnalyticsId: string;
    metaTags: {
      title: string;
      description: string;
      keywords: string;
    };
    seoEnabled: boolean;
    sitemapEnabled: boolean;
  };
  system: {
    debugMode: boolean;
    apiKeys: {
      emailjs: string;
      firebase: string;
    };
    cronJobs: boolean;
    autoBackup: boolean;
  };
}

interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  minOrder: number;
  maxUses: number;
  currentUses: number;
  expiryDate: string;
  active: boolean;
}

const Admin = () => {
  const { isAdmin, isSubAdmin, canMakeChanges, logout } = useAuth();
  const {
    products,
    flavors,
    deleteProduct,
    deleteFlavor,
    addProduct,
    addFlavor,
    updateProduct,
    updateFlavor,
  } = useProducts();
  const { orders } = useOrders();
  const navigate = useNavigate();

  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [activeSettingsTab, setActiveSettingsTab] = useState("general");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<
    "product" | "coupon" | "flavor" | "user" | "order"
  >("product");
  const [editingItem, setEditingItem] = useState<any>(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Enhanced users with Firebase-like data
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Alex Rodriguez",
      email: "alex.rodriguez@gmail.com",
      phone: "+1234567890",
      joinDate: "2024-01-15",
      lastLogin: "2024-12-28",
      orders: 5,
      totalSpent: 87.45,
      status: "active",
      avatar: "👤",
      address: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
      },
      preferences: {
        newsletter: true,
        promotions: false,
        orderUpdates: true,
      },
    },
    {
      id: "2",
      name: "Sarah Chen",
      email: "sarah.chen@outlook.com",
      phone: "+1987654321",
      joinDate: "2024-02-20",
      lastLogin: "2024-12-27",
      orders: 3,
      totalSpent: 45.99,
      status: "active",
      avatar: "👩",
      preferences: {
        newsletter: true,
        promotions: true,
        orderUpdates: true,
      },
    },
    {
      id: "3",
      name: "Marcus Johnson",
      email: "marcus.johnson@yahoo.com",
      phone: "+1555123456",
      joinDate: "2024-03-10",
      lastLogin: "2024-12-26",
      orders: 8,
      totalSpent: 156.32,
      status: "active",
      avatar: "👨",
      address: {
        street: "456 Oak Avenue",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "USA",
      },
      preferences: {
        newsletter: false,
        promotions: true,
        orderUpdates: true,
      },
    },
    {
      id: "4",
      name: "Emma Williams",
      email: "emma.williams@gmail.com",
      phone: "+1777888999",
      joinDate: "2024-04-05",
      lastLogin: "2024-12-25",
      orders: 2,
      totalSpent: 29.98,
      status: "active",
      avatar: "👩‍💼",
      address: {
        street: "789 Pine Street",
        city: "Chicago",
        state: "IL",
        zipCode: "60601",
        country: "USA",
      },
      preferences: {
        newsletter: true,
        promotions: false,
        orderUpdates: false,
      },
    },
  ]);

  // Enhanced orders with tracking
  const [ordersWithTracking, setOrdersWithTracking] = useState<
    OrderWithTracking[]
  >([
    {
      id: "1",
      trackingId: "CAT-ABC123XYZ456",
      status: "shipped",
      orderDate: new Date("2024-12-25"),
      estimatedDelivery: new Date("2024-12-30"),
      shippingAddress: {
        fullName: "Alex Rodriguez",
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
      },
      items: [
        {
          id: "mango-bluster",
          name: "Mango Bluster",
          price: 4.99,
          quantity: 2,
          image: "🥭",
        },
      ],
      totalAmount: 9.98,
      paymentMethod: "stripe",
      trackingUpdates: [
        {
          date: new Date("2024-12-25"),
          status: "Order Placed",
          location: "New York, NY",
          description: "Your order has been received and is being processed",
        },
        {
          date: new Date("2024-12-26"),
          status: "In Transit",
          location: "Distribution Center, NJ",
          description: "Package is on its way to delivery location",
        },
      ],
    },
    {
      id: "2",
      trackingId: "CAT-DEF456ABC789",
      status: "delivered",
      orderDate: new Date("2024-12-20"),
      estimatedDelivery: new Date("2024-12-25"),
      actualDelivery: new Date("2024-12-24"),
      shippingAddress: {
        fullName: "Sarah Chen",
        street: "456 Oak Avenue",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "USA",
      },
      items: [
        {
          id: "arctic-rush",
          name: "Arctic Rush",
          price: 4.99,
          quantity: 1,
          image: "❄️",
        },
        {
          id: "crimson-storm",
          name: "Crimson Storm",
          price: 4.99,
          quantity: 2,
          image: "🌪️",
        },
      ],
      totalAmount: 14.97,
      paymentMethod: "paypal",
      trackingUpdates: [
        {
          date: new Date("2024-12-20"),
          status: "Order Placed",
          location: "Los Angeles, CA",
          description: "Your order has been received and is being processed",
        },
        {
          date: new Date("2024-12-21"),
          status: "Processing",
          location: "Warehouse, CA",
          description: "Order is being prepared for shipment",
        },
        {
          date: new Date("2024-12-22"),
          status: "Shipped",
          location: "Distribution Center, CA",
          description: "Package has been shipped",
        },
        {
          date: new Date("2024-12-24"),
          status: "Delivered",
          location: "Los Angeles, CA",
          description: "Package has been delivered successfully",
        },
      ],
    },
    {
      id: "3",
      trackingId: "CAT-GHI789JKL012",
      status: "processing",
      orderDate: new Date("2024-12-28"),
      estimatedDelivery: new Date("2025-01-02"),
      shippingAddress: {
        fullName: "Marcus Johnson",
        street: "789 Pine Street",
        city: "Chicago",
        state: "IL",
        zipCode: "60601",
        country: "USA",
      },
      items: [
        {
          id: "volt-burst",
          name: "Volt Burst",
          price: 4.99,
          quantity: 4,
          image: "⚡",
        },
      ],
      totalAmount: 19.96,
      paymentMethod: "stripe",
      trackingUpdates: [
        {
          date: new Date("2024-12-28"),
          status: "Order Placed",
          location: "Chicago, IL",
          description: "Your order has been received and is being processed",
        },
      ],
    },
  ]);

  // Settings state
  const [settings, setSettings] = useState<Settings>({
    general: {
      siteName: "Catrink Energy Drinks",
      logo: "/logo.png",
      favicon: "/favicon.ico",
      theme: "dark",
      language: "en",
      timezone: "America/New_York",
      maintenanceMode: false,
      welcomeMessage: "Awaken the Cat reflex Inside you",
    },
    payments: {
      stripe: { enabled: true, publicKey: "", secretKey: "" },
      razorpay: { enabled: false, keyId: "", keySecret: "" },
      paypal: { enabled: false, clientId: "", clientSecret: "" },
      currency: "USD",
      enableCoupons: true,
      taxRate: 8.5,
      refundPolicy: "30-day refund policy",
    },
    email: {
      smtpHost: "smtp.gmail.com",
      smtpPort: 587,
      smtpUser: "",
      smtpPassword: "",
      senderName: "Catrink Support",
      senderEmail: "support@catrink.com",
      templates: {
        welcome: "Welcome to Catrink!",
        passwordReset: "Reset your password",
        orderConfirmation: "Order confirmation",
      },
    },
    notifications: {
      systemNotifications: true,
      emailNotifications: true,
      userSignupAlert: true,
      orderPlacedAlert: true,
      pushNotifications: false,
    },
    analytics: {
      googleAnalyticsId: "",
      metaTags: {
        title: "Catrink - Energy Drinks",
        description: "Awaken your inner cat with Catrink energy drinks",
        keywords: "energy drinks, catrink, cat energy",
      },
      seoEnabled: true,
      sitemapEnabled: true,
    },
    system: {
      debugMode: false,
      apiKeys: {
        emailjs: "wI1Qo5uf_5A-iCy0u",
        firebase: "",
      },
      cronJobs: true,
      autoBackup: true,
    },
  });

  // Form states
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    flavor: "",
    energy: "Medium" as "Medium" | "High" | "Ultra",
    rating: "",
    reviews: "",
    category: "",
  });

  const [flavorForm, setFlavorForm] = useState({
    name: "",
    tagline: "",
    description: "",
    image: "",
    color: "",
    ingredients: "",
    energyLevel: "Medium" as "Medium" | "High" | "Ultra",
    rating: "",
    reviews: "",
    price: "",
    featured: false,
  });

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    status: "active" as "active" | "inactive" | "banned",
    password: "",
  });

  const [couponForm, setCouponForm] = useState({
    code: "",
    discount: "",
    type: "percentage" as "percentage" | "fixed",
    minOrder: "",
    maxUses: "",
    expiryDate: "",
    active: true,
  });

  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: "1",
      code: "FIRSTCAT",
      discount: 20,
      type: "percentage",
      minOrder: 10,
      maxUses: 100,
      currentUses: 23,
      expiryDate: "2024-12-31",
      active: true,
    },
    {
      id: "2",
      code: "ENERGY50",
      discount: 5,
      type: "fixed",
      minOrder: 25,
      maxUses: 50,
      currentUses: 12,
      expiryDate: "2024-06-30",
      active: true,
    },
  ]);

  // Load data from localStorage
  useEffect(() => {
    const savedCoupons = localStorage.getItem("catrink_coupons");
    const savedUsers = localStorage.getItem("catrink_admin_users");
    const savedSettings = localStorage.getItem("catrink_admin_settings");
    const savedOrders = localStorage.getItem("catrink_admin_orders");

    if (savedCoupons) {
      try {
        setCoupons(JSON.parse(savedCoupons));
      } catch (error) {
        console.error("Error loading coupons:", error);
      }
    }

    if (savedUsers) {
      try {
        setUsers(JSON.parse(savedUsers));
      } catch (error) {
        console.error("Error loading users:", error);
      }
    }

    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    }

    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        const ordersWithDates = parsedOrders.map((order: any) => ({
          ...order,
          orderDate: new Date(order.orderDate),
          estimatedDelivery: new Date(order.estimatedDelivery),
          actualDelivery: order.actualDelivery
            ? new Date(order.actualDelivery)
            : undefined,
          trackingUpdates: order.trackingUpdates.map((update: any) => ({
            ...update,
            date: new Date(update.date),
          })),
        }));
        setOrdersWithTracking(ordersWithDates);
      } catch (error) {
        console.error("Error loading orders:", error);
      }
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem("catrink_coupons", JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem("catrink_admin_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("catrink_admin_settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(
      "catrink_admin_orders",
      JSON.stringify(ordersWithTracking),
    );
  }, [ordersWithTracking]);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/login");
      return;
    }
  }, [isAdmin, navigate]);

  const sidebarItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      glowColor: "text-red-400",
      shadowColor: "drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]",
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
      glowColor: "text-yellow-400",
      shadowColor: "drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]",
    },
    {
      id: "flavors",
      label: "Flavors",
      icon: Tag,
      glowColor: "text-green-400",
      shadowColor: "drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]",
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingBag,
      glowColor: "text-blue-400",
      shadowColor: "drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]",
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      glowColor: "text-purple-400",
      shadowColor: "drop-shadow-[0_0_10px_rgba(147,51,234,0.8)]",
    },
    {
      id: "coupons",
      label: "Coupons",
      icon: Tag,
      glowColor: "text-pink-400",
      shadowColor: "drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      glowColor: "text-cyan-400",
      shadowColor: "drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]",
    },
  ];

  const settingsTabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "email", label: "Email", icon: Mail },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "analytics", label: "Analytics & SEO", icon: BarChart3 },
    { id: "system", label: "System", icon: Database },
    { id: "roles", label: "Roles & Permissions", icon: UserCheck },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const updateOrderStatus = (
    orderId: string,
    newStatus: OrderWithTracking["status"],
    location?: string,
  ) => {
    setOrdersWithTracking((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const newUpdate = {
            date: new Date(),
            status:
              newStatus.charAt(0).toUpperCase() +
              newStatus.slice(1).replace("-", " "),
            location: location || "Processing Center",
            description: getStatusDescription(newStatus),
          };

          return {
            ...order,
            status: newStatus,
            actualDelivery:
              newStatus === "delivered" ? new Date() : order.actualDelivery,
            trackingUpdates: [...order.trackingUpdates, newUpdate],
          };
        }
        return order;
      }),
    );
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "processing":
        return "Order is being prepared for shipment";
      case "shipped":
        return "Package has been shipped and is in transit";
      case "out-for-delivery":
        return "Package is out for delivery";
      case "delivered":
        return "Package has been successfully delivered";
      case "cancelled":
        return "Order has been cancelled";
      default:
        return "Status updated";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "text-yellow-400 bg-yellow-500/20";
      case "shipped":
        return "text-blue-400 bg-blue-500/20";
      case "out-for-delivery":
        return "text-purple-400 bg-purple-500/20";
      case "delivered":
        return "text-green-400 bg-green-500/20";
      case "cancelled":
        return "text-red-400 bg-red-500/20";
      default:
        return "text-gray-400 bg-gray-500/20";
    }
  };

  const openModal = (
    type: "product" | "coupon" | "flavor" | "user" | "order",
    item?: any,
  ) => {
    // For add operations (when item is undefined) check demo restriction
    if (!item && !checkDemoRestriction()) return;

    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  // Check if user can make changes (demo restriction)
  const checkDemoRestriction = () => {
    if (!canMakeChanges) {
      alert("You can't make changes in demo website!");
      return false;
    }
    return true;
  };

  // Populate forms when editing
  useEffect(() => {
    if (editingItem && modalType === "product") {
      setProductForm({
        name: editingItem.name || "",
        price: editingItem.price?.toString() || "",
        image: editingItem.image || "",
        description: editingItem.description || "",
        flavor: editingItem.flavor || "",
        energy: editingItem.energy || "Medium",
        rating: editingItem.rating?.toString() || "",
        reviews: editingItem.reviews?.toString() || "",
        category: editingItem.category || "",
      });
    } else if (editingItem && modalType === "coupon") {
      setCouponForm({
        code: editingItem.code || "",
        discount: editingItem.discount?.toString() || "",
        type: editingItem.type || "percentage",
        minOrder: editingItem.minOrder?.toString() || "",
        maxUses: editingItem.maxUses?.toString() || "",
        expiryDate: editingItem.expiryDate || "",
        active: editingItem.active !== undefined ? editingItem.active : true,
      });
    } else if (editingItem && modalType === "flavor") {
      setFlavorForm({
        name: editingItem.name || "",
        tagline: editingItem.tagline || "",
        description: editingItem.description || "",
        image: editingItem.image || "",
        color: editingItem.color || "",
        ingredients: editingItem.ingredients || "",
        energyLevel: editingItem.energyLevel || "Medium",
        rating: editingItem.rating?.toString() || "",
      });
    } else if (editingItem && modalType === "user") {
      setUserForm({
        name: editingItem.name || "",
        email: editingItem.email || "",
        phone: editingItem.phone || "",
        status: editingItem.status || "active",
        password: "", // Don't prefill password for security
      });
    }
  }, [editingItem, modalType]);

  // Print Invoice function
  const printInvoice = (order: OrderWithTracking) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${order.trackingId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .invoice-details { margin-bottom: 20px; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .items-table th { background-color: #f2f2f2; }
            .total { text-align: right; font-weight: bold; font-size: 18px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>CATRINK ENERGY</h1>
            <h2>Invoice</h2>
          </div>
          <div class="invoice-details">
            <p><strong>Order ID:</strong> ${order.trackingId}</p>
            <p><strong>Order Date:</strong> ${order.orderDate.toLocaleDateString()}</p>
            <p><strong>Customer:</strong> ${order.shippingAddress.fullName}</p>
            <p><strong>Shipping Address:</strong><br>
              ${order.shippingAddress.street}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
              ${order.shippingAddress.country}
            </p>
          </div>
          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.price.toFixed(2)}</td>
                  <td>$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
          <div class="total">
            <p>Total Amount: $${order.totalAmount.toFixed(2)}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    printWindow.print();
  };

  // Send Update function
  const sendUpdate = (order: OrderWithTracking) => {
    // In a real app, this would send an email/SMS to the customer
    alert(
      `Update sent to customer for order ${order.trackingId}!\n\nStatus: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}\nTracking ID: ${order.trackingId}\n\nThe customer has been notified via email about the current status of their order.`,
    );
  };

  // Form submission handlers
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkDemoRestriction()) return;
    if (editingItem) {
      // Update existing product
      setProducts(
        products.map((p) =>
          p.id === editingItem.id
            ? { ...p, ...productForm, id: editingItem.id }
            : p,
        ),
      );
    } else {
      // Add new product
      const newProduct = {
        ...productForm,
        id: Date.now().toString(),
        price: parseFloat(productForm.price),
        rating: parseFloat(productForm.rating),
        reviews: parseInt(productForm.reviews),
      };
      setProducts([...products, newProduct]);
    }
    setProductForm({
      name: "",
      price: "",
      image: "",
      description: "",
      flavor: "",
      energy: "Medium",
      rating: "",
      reviews: "",
      category: "",
    });
    closeModal();
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkDemoRestriction()) return;
    if (editingItem) {
      // Update existing coupon
      setCoupons(
        coupons.map((c) =>
          c.id === editingItem.id
            ? {
                ...c,
                ...couponForm,
                id: editingItem.id,
                discount: parseFloat(couponForm.discount),
                minOrder: parseFloat(couponForm.minOrder),
                maxUses: parseInt(couponForm.maxUses),
                currentUses: c.currentUses, // Keep current uses
              }
            : c,
        ),
      );
    } else {
      // Add new coupon
      const newCoupon = {
        ...couponForm,
        id: Date.now().toString(),
        discount: parseFloat(couponForm.discount),
        minOrder: parseFloat(couponForm.minOrder),
        maxUses: parseInt(couponForm.maxUses),
        currentUses: 0,
      };
      setCoupons([...coupons, newCoupon]);
    }
    setCouponForm({
      code: "",
      discount: "",
      type: "percentage",
      minOrder: "",
      maxUses: "",
      expiryDate: "",
      active: true,
    });
    closeModal();
  };

  const handleFlavorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkDemoRestriction()) return;
    if (editingItem) {
      // Update existing flavor
      setFlavors(
        flavors.map((f) =>
          f.id === editingItem.id
            ? {
                ...f,
                ...flavorForm,
                id: editingItem.id,
                rating: parseFloat(flavorForm.rating),
              }
            : f,
        ),
      );
    } else {
      // Add new flavor
      const newFlavor = {
        ...flavorForm,
        id: Date.now().toString(),
        rating: parseFloat(flavorForm.rating),
      };
      setFlavors([...flavors, newFlavor]);
    }
    setFlavorForm({
      name: "",
      tagline: "",
      description: "",
      image: "",
      color: "",
      ingredients: "",
      energyLevel: "Medium",
      rating: "",
    });
    closeModal();
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkDemoRestriction()) return;
    if (editingItem) {
      // Update existing user
      setUsers(
        users.map((u) =>
          u.id === editingItem.id
            ? { ...u, ...userForm, id: editingItem.id }
            : u,
        ),
      );
    } else {
      // Add new user
      const newUser = {
        ...userForm,
        id: Date.now().toString(),
        joinDate: new Date().toISOString().split("T")[0],
        lastLogin: new Date().toISOString().split("T")[0],
        orders: 0,
        totalSpent: 0,
        avatar: "👤",
        address: {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "USA",
        },
        preferences: {
          newsletter: true,
          promotions: false,
          orderUpdates: true,
        },
      };
      setUsers([...users, newUser]);
    }
    setUserForm({
      name: "",
      email: "",
      phone: "",
      status: "active",
      password: "",
    });
    closeModal();
  };

  // Dashboard stats
  const stats = {
    totalUsers: users.length,
    totalOrders: ordersWithTracking.length,
    totalRevenue: ordersWithTracking.reduce(
      (sum, order) => sum + order.totalAmount,
      0,
    ),
    totalProducts: products.length,
    activeCoupons: coupons.filter((c) => c.active).length,
    pendingOrders: ordersWithTracking.filter((o) => o.status === "processing")
      .length,
    deliveredOrders: ordersWithTracking.filter((o) => o.status === "delivered")
      .length,
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredOrders = ordersWithTracking.filter(
    (order) =>
      order.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-900/80 border-r border-white/10 backdrop-blur-md relative"
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="font-orbitron font-bold text-white">
                    Admin Panel
                  </h2>
                  <p className="text-xs text-white/60">Catrink Management</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300",
                activeSection === item.id
                  ? `bg-neon-blue/20 ${item.glowColor} filter ${item.shadowColor}`
                  : "text-white/70 hover:text-white hover:bg-white/10",
              )}
            >
              <item.icon className="w-5 h-5" />
              {!sidebarCollapsed && (
                <span className="font-orbitron font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span className="font-orbitron">Logout</span>}
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden bg-slate-900">
        {/* Top Bar */}
        <div className="h-16 border-b border-white/10 bg-slate-800/50 backdrop-blur-md px-6 flex items-center justify-between">
          <div>
            <h1 className="font-orbitron font-bold text-xl text-white capitalize">
              {activeSection === "dashboard"
                ? "Dashboard Overview"
                : activeSection}
            </h1>
            <p className="text-sm text-white/60">
              {activeSection === "dashboard"
                ? "Welcome back, Administrator"
                : `Manage ${activeSection}`}
            </p>
          </div>

          {/* Search Bar */}
          {(activeSection === "users" || activeSection === "orders") && (
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Search ${activeSection}...`}
                  className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-blue"
                />
              </div>
              {activeSection === "users" && (
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-neon-purple"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="banned">Banned</option>
                </select>
              )}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-6 h-[calc(100vh-4rem)] overflow-y-auto bg-slate-900">
          {/* Dashboard */}
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Total Users</p>
                      <p className="text-2xl font-bold text-white">
                        {stats.totalUsers}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-neon-blue" />
                  </div>
                </div>

                <div className="glass-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Total Orders</p>
                      <p className="text-2xl font-bold text-white">
                        {stats.totalOrders}
                      </p>
                    </div>
                    <ShoppingBag className="w-8 h-8 text-neon-purple" />
                  </div>
                </div>

                <div className="glass-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Revenue</p>
                      <p className="text-2xl font-bold text-white">
                        ${stats.totalRevenue.toFixed(2)}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-neon-green" />
                  </div>
                </div>

                <div className="glass-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Pending Orders</p>
                      <p className="text-2xl font-bold text-white">
                        {stats.pendingOrders}
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-neon-yellow" />
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="glass-card p-6">
                <h3 className="font-orbitron font-bold text-xl text-white mb-4">
                  Recent Orders
                </h3>
                <div className="space-y-4">
                  {ordersWithTracking.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-white">
                          {order.trackingId}
                        </p>
                        <p className="text-sm text-white/60">
                          {order.shippingAddress.fullName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-neon-green">
                          ${order.totalAmount.toFixed(2)}
                        </p>
                        <p className="text-sm text-white/60">
                          {order.orderDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Orders Management */}
          {activeSection === "orders" && (
            <div>
              <h2 className="font-orbitron font-bold text-2xl text-white mb-6">
                Orders Management
              </h2>

              <div className="glass-card p-6">
                <div className="space-y-6">
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="p-6 bg-white/5 rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-4">
                            <h3 className="font-semibold text-white text-lg">
                              {order.trackingId}
                            </h3>
                            <span
                              className={cn(
                                "px-3 py-1 rounded-full text-xs font-semibold",
                                getStatusColor(order.status),
                              )}
                            >
                              {order.status.replace("-", " ").toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-white/60">
                            Customer: {order.shippingAddress.fullName}
                          </p>
                          <p className="text-sm text-white/60">
                            Order Date: {order.orderDate.toLocaleDateString()}
                          </p>
                          <p className="text-sm text-white/60">
                            Estimated Delivery:{" "}
                            {order.estimatedDelivery.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-neon-green text-xl">
                            ${order.totalAmount.toFixed(2)}
                          </p>
                          <p className="text-sm text-white/60">
                            {order.paymentMethod.toUpperCase()}
                          </p>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="mb-4 p-4 bg-white/5 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">
                          Items:
                        </h4>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">{item.image}</span>
                                <span className="text-white">{item.name}</span>
                                <span className="text-white/60">
                                  x{item.quantity}
                                </span>
                              </div>
                              <span className="text-neon-cyan">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Status Update Buttons */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {[
                          "processing",
                          "shipped",
                          "out-for-delivery",
                          "delivered",
                          "cancelled",
                        ].map((status) => (
                          <button
                            key={status}
                            onClick={() =>
                              updateOrderStatus(order.id, status as any)
                            }
                            disabled={order.status === status}
                            className={cn(
                              "px-3 py-1 rounded-lg text-xs font-semibold transition-colors",
                              order.status === status
                                ? "bg-white/20 text-white/50 cursor-not-allowed"
                                : "bg-neon-blue/20 text-neon-blue hover:bg-neon-blue/30",
                            )}
                          >
                            {status.replace("-", " ").toUpperCase()}
                          </button>
                        ))}
                      </div>

                      {/* Tracking Updates */}
                      <div className="border-t border-white/10 pt-4">
                        <h4 className="font-semibold text-white mb-3 flex items-center">
                          <Truck className="w-4 h-4 mr-2" />
                          Tracking History
                        </h4>
                        <div className="space-y-3">
                          {order.trackingUpdates.map((update, index) => (
                            <div
                              key={index}
                              className="flex items-start space-x-3"
                            >
                              <div className="w-2 h-2 bg-neon-blue rounded-full mt-2"></div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium text-white">
                                    {update.status}
                                  </p>
                                  <p className="text-xs text-white/60">
                                    {update.date.toLocaleDateString()}{" "}
                                    {update.date.toLocaleTimeString()}
                                  </p>
                                </div>
                                <p className="text-sm text-white/60">
                                  {update.location}
                                </p>
                                <p className="text-sm text-white/40">
                                  {update.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2 mt-4 pt-4 border-t border-white/10">
                        <button
                          onClick={() => openModal("order", order)}
                          className="px-4 py-2 bg-neon-blue/20 text-neon-blue rounded-lg hover:bg-neon-blue/30 transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => printInvoice(order)}
                          className="px-4 py-2 bg-neon-purple/20 text-neon-purple rounded-lg hover:bg-neon-purple/30 transition-colors"
                        >
                          Print Invoice
                        </button>
                        <button
                          onClick={() => sendUpdate(order)}
                          className="px-4 py-2 bg-neon-green/20 text-neon-green rounded-lg hover:bg-neon-green/30 transition-colors"
                        >
                          Send Update
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Users Management */}
          {activeSection === "users" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-orbitron font-bold text-2xl text-white">
                  Users Management
                </h2>
                <button
                  onClick={() => openModal("user")}
                  className="catrink-button flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add User</span>
                </button>
              </div>

              <div className="glass-card p-6">
                <div className="space-y-6">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="p-6 bg-white/5 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="text-3xl">{user.avatar}</div>
                          <div className="space-y-2">
                            <div>
                              <h3 className="font-semibold text-white text-lg">
                                {user.name}
                              </h3>
                              <p className="text-sm text-white/60">
                                {user.email}
                              </p>
                              <p className="text-sm text-white/60">
                                {user.phone}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-white/40">Joined</p>
                                <p className="text-white/60">{user.joinDate}</p>
                              </div>
                              <div>
                                <p className="text-white/40">Last Login</p>
                                <p className="text-white/60">
                                  {user.lastLogin}
                                </p>
                              </div>
                              <div>
                                <p className="text-white/40">Orders</p>
                                <p className="text-white/60">{user.orders}</p>
                              </div>
                              <div>
                                <p className="text-white/40">Total Spent</p>
                                <p className="text-neon-green">
                                  ${user.totalSpent.toFixed(2)}
                                </p>
                              </div>
                            </div>

                            {user.address && (
                              <div className="mt-3 p-3 bg-white/5 rounded-lg">
                                <p className="text-white/40 text-xs mb-1">
                                  Address
                                </p>
                                <p className="text-white/60 text-sm">
                                  {user.address.street}, {user.address.city},{" "}
                                  {user.address.state} {user.address.zipCode},{" "}
                                  {user.address.country}
                                </p>
                              </div>
                            )}

                            {user.preferences && (
                              <div className="mt-3 p-3 bg-white/5 rounded-lg">
                                <p className="text-white/40 text-xs mb-2">
                                  Preferences
                                </p>
                                <div className="flex space-x-4 text-sm">
                                  <span
                                    className={cn(
                                      "px-2 py-1 rounded",
                                      user.preferences.newsletter
                                        ? "bg-green-500/20 text-green-400"
                                        : "bg-red-500/20 text-red-400",
                                    )}
                                  >
                                    Newsletter:{" "}
                                    {user.preferences.newsletter ? "Yes" : "No"}
                                  </span>
                                  <span
                                    className={cn(
                                      "px-2 py-1 rounded",
                                      user.preferences.promotions
                                        ? "bg-green-500/20 text-green-400"
                                        : "bg-red-500/20 text-red-400",
                                    )}
                                  >
                                    Promotions:{" "}
                                    {user.preferences.promotions ? "Yes" : "No"}
                                  </span>
                                  <span
                                    className={cn(
                                      "px-2 py-1 rounded",
                                      user.preferences.orderUpdates
                                        ? "bg-green-500/20 text-green-400"
                                        : "bg-red-500/20 text-red-400",
                                    )}
                                  >
                                    Updates:{" "}
                                    {user.preferences.orderUpdates
                                      ? "Yes"
                                      : "No"}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end space-y-3">
                          <span
                            className={cn(
                              "px-3 py-1 rounded-full text-xs font-semibold",
                              user.status === "active" &&
                                "bg-green-500/20 text-green-400",
                              user.status === "inactive" &&
                                "bg-yellow-500/20 text-yellow-400",
                              user.status === "banned" &&
                                "bg-red-500/20 text-red-400",
                            )}
                          >
                            {user.status.toUpperCase()}
                          </span>

                          <div className="flex space-x-2">
                            <button
                              onClick={() => openModal("user", user)}
                              className="p-2 bg-neon-blue/20 text-neon-blue rounded-lg hover:bg-neon-blue/30 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-neon-purple/20 text-neon-purple rounded-lg hover:bg-neon-purple/30 transition-colors">
                              <Mail className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Complete Settings System */}
          {activeSection === "settings" && (
            <div>
              <h2 className="font-orbitron font-bold text-2xl text-white mb-6">
                System Settings
              </h2>

              <div className="flex gap-6">
                {/* Settings Sidebar */}
                <div className="w-64 space-y-2">
                  {settingsTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSettingsTab(tab.id)}
                      className={cn(
                        "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left",
                        activeSettingsTab === tab.id
                          ? "bg-neon-blue/20 text-neon-blue"
                          : "text-white/70 hover:text-white hover:bg-white/10",
                      )}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span className="font-orbitron text-sm">{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Settings Content */}
                <div className="flex-1">
                  <div className="glass-card p-8">
                    {/* General Settings */}
                    {activeSettingsTab === "general" && (
                      <div className="space-y-6">
                        <h3 className="font-orbitron font-bold text-xl text-white mb-4">
                          General Settings
                        </h3>

                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="block text-white/80 text-sm font-semibold mb-2">
                              Site Name / Brand Title
                            </label>
                            <input
                              type="text"
                              value={settings.general.siteName}
                              onChange={(e) =>
                                setSettings((prev) => ({
                                  ...prev,
                                  general: {
                                    ...prev.general,
                                    siteName: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-blue"
                            />
                          </div>

                          <div>
                            <label className="block text-white/80 text-sm font-semibold mb-2">
                              Default Language
                            </label>
                            <select
                              value={settings.general.language}
                              onChange={(e) =>
                                setSettings((prev) => ({
                                  ...prev,
                                  general: {
                                    ...prev.general,
                                    language: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-neon-purple"
                            >
                              <option value="en">English</option>
                              <option value="es">Spanish</option>
                              <option value="fr">French</option>
                              <option value="de">German</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-white/80 text-sm font-semibold mb-2">
                              Theme
                            </label>
                            <select
                              value={settings.general.theme}
                              onChange={(e) =>
                                setSettings((prev) => ({
                                  ...prev,
                                  general: {
                                    ...prev.general,
                                    theme: e.target.value as any,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
                            >
                              <option value="light">Light</option>
                              <option value="dark">Dark</option>
                              <option value="auto">Auto</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-white/80 text-sm font-semibold mb-2">
                              Timezone
                            </label>
                            <select
                              value={settings.general.timezone}
                              onChange={(e) =>
                                setSettings((prev) => ({
                                  ...prev,
                                  general: {
                                    ...prev.general,
                                    timezone: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-neon-red"
                            >
                              <option value="America/New_York">
                                Eastern Time
                              </option>
                              <option value="America/Los_Angeles">
                                Pacific Time
                              </option>
                              <option value="Europe/London">London Time</option>
                              <option value="Asia/Tokyo">Tokyo Time</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-white/80 text-sm font-semibold mb-2">
                            Welcome Message / Site Description
                          </label>
                          <textarea
                            rows={3}
                            value={settings.general.welcomeMessage}
                            onChange={(e) =>
                              setSettings((prev) => ({
                                ...prev,
                                general: {
                                  ...prev.general,
                                  welcomeMessage: e.target.value,
                                },
                              }))
                            }
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-pink resize-none"
                          />
                        </div>

                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={settings.general.maintenanceMode}
                            onChange={(e) =>
                              setSettings((prev) => ({
                                ...prev,
                                general: {
                                  ...prev.general,
                                  maintenanceMode: e.target.checked,
                                },
                              }))
                            }
                            className="w-4 h-4 rounded border-2 border-white/20 bg-white/5 text-neon-blue focus:ring-neon-blue"
                          />
                          <label className="text-white font-orbitron">
                            Maintenance Mode
                          </label>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-white/80 text-sm font-semibold mb-2">
                              Logo Upload
                            </label>
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                                <Image className="w-6 h-6 text-white/40" />
                              </div>
                              <button className="px-4 py-2 bg-neon-blue/20 text-neon-blue rounded-lg hover:bg-neon-blue/30 transition-colors">
                                Upload Logo
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-white/80 text-sm font-semibold mb-2">
                              Favicon Upload
                            </label>
                            <div className="flex items-center space-x-4">
                              <div className="w-8 h-8 bg-white/5 border border-white/10 rounded flex items-center justify-center">
                                <Image className="w-4 h-4 text-white/40" />
                              </div>
                              <button className="px-4 py-2 bg-neon-purple/20 text-neon-purple rounded-lg hover:bg-neon-purple/30 transition-colors">
                                Upload Favicon
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Payment Settings */}
                    {activeSettingsTab === "payments" && (
                      <div className="space-y-6">
                        <h3 className="font-orbitron font-bold text-xl text-white mb-4">
                          Payment Settings
                        </h3>

                        <div className="space-y-6">
                          {/* Stripe */}
                          <div className="p-4 bg-white/5 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-semibold text-white">
                                Stripe
                              </h4>
                              <input
                                type="checkbox"
                                checked={settings.payments.stripe.enabled}
                                onChange={(e) =>
                                  setSettings((prev) => ({
                                    ...prev,
                                    payments: {
                                      ...prev.payments,
                                      stripe: {
                                        ...prev.payments.stripe,
                                        enabled: e.target.checked,
                                      },
                                    },
                                  }))
                                }
                                className="w-4 h-4 rounded border-2 border-white/20 bg-white/5 text-neon-blue focus:ring-neon-blue"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <input
                                type="text"
                                placeholder="Public Key"
                                value={settings.payments.stripe.publicKey}
                                onChange={(e) =>
                                  setSettings((prev) => ({
                                    ...prev,
                                    payments: {
                                      ...prev.payments,
                                      stripe: {
                                        ...prev.payments.stripe,
                                        publicKey: e.target.value,
                                      },
                                    },
                                  }))
                                }
                                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-blue"
                              />
                              <input
                                type="password"
                                placeholder="Secret Key"
                                value={settings.payments.stripe.secretKey}
                                onChange={(e) =>
                                  setSettings((prev) => ({
                                    ...prev,
                                    payments: {
                                      ...prev.payments,
                                      stripe: {
                                        ...prev.payments.stripe,
                                        secretKey: e.target.value,
                                      },
                                    },
                                  }))
                                }
                                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-blue"
                              />
                            </div>
                          </div>

                          {/* Currency & Tax */}
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="block text-white/80 text-sm font-semibold mb-2">
                                Currency
                              </label>
                              <select
                                value={settings.payments.currency}
                                onChange={(e) =>
                                  setSettings((prev) => ({
                                    ...prev,
                                    payments: {
                                      ...prev.payments,
                                      currency: e.target.value,
                                    },
                                  }))
                                }
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-neon-green"
                              >
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                                <option value="INR">INR</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-white/80 text-sm font-semibold mb-2">
                                Tax Rate (%)
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                value={settings.payments.taxRate}
                                onChange={(e) =>
                                  setSettings((prev) => ({
                                    ...prev,
                                    payments: {
                                      ...prev.payments,
                                      taxRate: parseFloat(e.target.value),
                                    },
                                  }))
                                }
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-yellow"
                              />
                            </div>

                            <div className="flex items-center space-x-3 pt-6">
                              <input
                                type="checkbox"
                                checked={settings.payments.enableCoupons}
                                onChange={(e) =>
                                  setSettings((prev) => ({
                                    ...prev,
                                    payments: {
                                      ...prev.payments,
                                      enableCoupons: e.target.checked,
                                    },
                                  }))
                                }
                                className="w-4 h-4 rounded border-2 border-white/20 bg-white/5 text-neon-blue focus:ring-neon-blue"
                              />
                              <label className="text-white font-orbitron text-sm">
                                Enable Coupons
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Email Settings */}
                    {activeSettingsTab === "email" && (
                      <div className="space-y-6">
                        <h3 className="font-orbitron font-bold text-xl text-white mb-4">
                          Email Settings
                        </h3>

                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="block text-white/80 text-sm font-semibold mb-2">
                              SMTP Host
                            </label>
                            <input
                              type="text"
                              value={settings.email.smtpHost}
                              onChange={(e) =>
                                setSettings((prev) => ({
                                  ...prev,
                                  email: {
                                    ...prev.email,
                                    smtpHost: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-blue"
                            />
                          </div>

                          <div>
                            <label className="block text-white/80 text-sm font-semibold mb-2">
                              SMTP Port
                            </label>
                            <input
                              type="number"
                              value={settings.email.smtpPort}
                              onChange={(e) =>
                                setSettings((prev) => ({
                                  ...prev,
                                  email: {
                                    ...prev.email,
                                    smtpPort: parseInt(e.target.value),
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-purple"
                            />
                          </div>

                          <div>
                            <label className="block text-white/80 text-sm font-semibold mb-2">
                              SMTP Username
                            </label>
                            <input
                              type="text"
                              value={settings.email.smtpUser}
                              onChange={(e) =>
                                setSettings((prev) => ({
                                  ...prev,
                                  email: {
                                    ...prev.email,
                                    smtpUser: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-cyan"
                            />
                          </div>

                          <div>
                            <label className="block text-white/80 text-sm font-semibold mb-2">
                              SMTP Password
                            </label>
                            <input
                              type="password"
                              value={settings.email.smtpPassword}
                              onChange={(e) =>
                                setSettings((prev) => ({
                                  ...prev,
                                  email: {
                                    ...prev.email,
                                    smtpPassword: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-red"
                            />
                          </div>

                          <div>
                            <label className="block text-white/80 text-sm font-semibold mb-2">
                              Sender Name
                            </label>
                            <input
                              type="text"
                              value={settings.email.senderName}
                              onChange={(e) =>
                                setSettings((prev) => ({
                                  ...prev,
                                  email: {
                                    ...prev.email,
                                    senderName: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-pink"
                            />
                          </div>

                          <div>
                            <label className="block text-white/80 text-sm font-semibold mb-2">
                              Sender Email
                            </label>
                            <input
                              type="email"
                              value={settings.email.senderEmail}
                              onChange={(e) =>
                                setSettings((prev) => ({
                                  ...prev,
                                  email: {
                                    ...prev.email,
                                    senderEmail: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-green"
                            />
                          </div>
                        </div>

                        <div className="flex justify-center">
                          <button className="px-6 py-3 bg-neon-blue/20 text-neon-blue rounded-lg hover:bg-neon-blue/30 transition-colors flex items-center space-x-2">
                            <Zap className="w-4 h-4" />
                            <span>Test Email Connection</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Notifications Settings */}
                    {activeSettingsTab === "notifications" && (
                      <div className="space-y-6">
                        <h3 className="font-orbitron font-bold text-xl text-white mb-4">
                          Notification Settings
                        </h3>

                        <div className="space-y-4">
                          {[
                            {
                              key: "systemNotifications",
                              label: "Enable System Notifications",
                            },
                            {
                              key: "emailNotifications",
                              label: "Enable Email Notifications",
                            },
                            {
                              key: "userSignupAlert",
                              label: "User Signup Notifications",
                            },
                            {
                              key: "orderPlacedAlert",
                              label: "Order Placed Notifications",
                            },
                            {
                              key: "pushNotifications",
                              label: "Push Notifications",
                            },
                          ].map((setting) => (
                            <div
                              key={setting.key}
                              className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                            >
                              <span className="text-white font-orbitron">
                                {setting.label}
                              </span>
                              <input
                                type="checkbox"
                                checked={
                                  (settings.notifications as any)[setting.key]
                                }
                                onChange={(e) =>
                                  setSettings((prev) => ({
                                    ...prev,
                                    notifications: {
                                      ...prev.notifications,
                                      [setting.key]: e.target.checked,
                                    },
                                  }))
                                }
                                className="w-4 h-4 rounded border-2 border-white/20 bg-white/5 text-neon-blue focus:ring-neon-blue"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Analytics Settings */}
                    {activeSettingsTab === "analytics" && (
                      <div className="space-y-6">
                        <h3 className="font-orbitron font-bold text-xl text-white mb-4">
                          Analytics & SEO Settings
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-white/80 text-sm font-semibold mb-2">
                              Google Analytics Tracking ID
                            </label>
                            <input
                              type="text"
                              value={settings.analytics.googleAnalyticsId}
                              onChange={(e) =>
                                setSettings((prev) => ({
                                  ...prev,
                                  analytics: {
                                    ...prev.analytics,
                                    googleAnalyticsId: e.target.value,
                                  },
                                }))
                              }
                              placeholder="UA-XXXXXXXXX-X"
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-blue"
                            />
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <label className="block text-white/80 text-sm font-semibold mb-2">
                                Meta Title
                              </label>
                              <input
                                type="text"
                                value={settings.analytics.metaTags.title}
                                onChange={(e) =>
                                  setSettings((prev) => ({
                                    ...prev,
                                    analytics: {
                                      ...prev.analytics,
                                      metaTags: {
                                        ...prev.analytics.metaTags,
                                        title: e.target.value,
                                      },
                                    },
                                  }))
                                }
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-purple"
                              />
                            </div>

                            <div>
                              <label className="block text-white/80 text-sm font-semibold mb-2">
                                Meta Description
                              </label>
                              <textarea
                                rows={2}
                                value={settings.analytics.metaTags.description}
                                onChange={(e) =>
                                  setSettings((prev) => ({
                                    ...prev,
                                    analytics: {
                                      ...prev.analytics,
                                      metaTags: {
                                        ...prev.analytics.metaTags,
                                        description: e.target.value,
                                      },
                                    },
                                  }))
                                }
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-cyan resize-none"
                              />
                            </div>

                            <div>
                              <label className="block text-white/80 text-sm font-semibold mb-2">
                                Meta Keywords
                              </label>
                              <input
                                type="text"
                                value={settings.analytics.metaTags.keywords}
                                onChange={(e) =>
                                  setSettings((prev) => ({
                                    ...prev,
                                    analytics: {
                                      ...prev.analytics,
                                      metaTags: {
                                        ...prev.analytics.metaTags,
                                        keywords: e.target.value,
                                      },
                                    },
                                  }))
                                }
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-red"
                              />
                            </div>
                          </div>

                          <div className="flex space-x-6">
                            <div className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={settings.analytics.seoEnabled}
                                onChange={(e) =>
                                  setSettings((prev) => ({
                                    ...prev,
                                    analytics: {
                                      ...prev.analytics,
                                      seoEnabled: e.target.checked,
                                    },
                                  }))
                                }
                                className="w-4 h-4 rounded border-2 border-white/20 bg-white/5 text-neon-blue focus:ring-neon-blue"
                              />
                              <label className="text-white font-orbitron">
                                SEO Enabled
                              </label>
                            </div>

                            <div className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={settings.analytics.sitemapEnabled}
                                onChange={(e) =>
                                  setSettings((prev) => ({
                                    ...prev,
                                    analytics: {
                                      ...prev.analytics,
                                      sitemapEnabled: e.target.checked,
                                    },
                                  }))
                                }
                                className="w-4 h-4 rounded border-2 border-white/20 bg-white/5 text-neon-blue focus:ring-neon-blue"
                              />
                              <label className="text-white font-orbitron">
                                Generate Sitemap
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* System Settings */}
                    {activeSettingsTab === "system" && (
                      <div className="space-y-6">
                        <h3 className="font-orbitron font-bold text-xl text-white mb-4">
                          System Settings
                        </h3>

                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-white/80 text-sm font-semibold mb-2">
                                EmailJS API Key
                              </label>
                              <input
                                type="text"
                                value={settings.system.apiKeys.emailjs}
                                onChange={(e) =>
                                  setSettings((prev) => ({
                                    ...prev,
                                    system: {
                                      ...prev.system,
                                      apiKeys: {
                                        ...prev.system.apiKeys,
                                        emailjs: e.target.value,
                                      },
                                    },
                                  }))
                                }
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-blue"
                              />
                            </div>

                            <div>
                              <label className="block text-white/80 text-sm font-semibold mb-2">
                                Firebase API Key
                              </label>
                              <input
                                type="text"
                                value={settings.system.apiKeys.firebase}
                                onChange={(e) =>
                                  setSettings((prev) => ({
                                    ...prev,
                                    system: {
                                      ...prev.system,
                                      apiKeys: {
                                        ...prev.system.apiKeys,
                                        firebase: e.target.value,
                                      },
                                    },
                                  }))
                                }
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-purple"
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            {[
                              { key: "debugMode", label: "Debug Mode" },
                              { key: "cronJobs", label: "Enable Cron Jobs" },
                              {
                                key: "autoBackup",
                                label: "Auto Database Backup",
                              },
                            ].map((setting) => (
                              <div
                                key={setting.key}
                                className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                              >
                                <span className="text-white font-orbitron">
                                  {setting.label}
                                </span>
                                <input
                                  type="checkbox"
                                  checked={
                                    (settings.system as any)[setting.key]
                                  }
                                  onChange={(e) =>
                                    setSettings((prev) => ({
                                      ...prev,
                                      system: {
                                        ...prev.system,
                                        [setting.key]: e.target.checked,
                                      },
                                    }))
                                  }
                                  className="w-4 h-4 rounded border-2 border-white/20 bg-white/5 text-neon-blue focus:ring-neon-blue"
                                />
                              </div>
                            ))}
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <button className="px-4 py-3 bg-neon-red/20 text-neon-red rounded-lg hover:bg-neon-red/30 transition-colors flex items-center justify-center space-x-2">
                              <RefreshCw className="w-4 h-4" />
                              <span>Clear Cache</span>
                            </button>

                            <button className="px-4 py-3 bg-neon-green/20 text-neon-green rounded-lg hover:bg-neon-green/30 transition-colors flex items-center justify-center space-x-2">
                              <Download className="w-4 h-4" />
                              <span>Backup Database</span>
                            </button>

                            <button className="px-4 py-3 bg-neon-yellow/20 text-neon-yellow rounded-lg hover:bg-neon-yellow/30 transition-colors flex items-center justify-center space-x-2">
                              <FileText className="w-4 h-4" />
                              <span>View Error Logs</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Save Button for all settings */}
                    <div className="pt-6 border-t border-white/10">
                      <button className="w-full catrink-button flex items-center justify-center space-x-2">
                        <Save className="w-5 h-5" />
                        <span>Save Settings</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products, Flavors, Coupons sections remain the same as before */}
          {activeSection === "products" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-orbitron font-bold text-2xl text-white">
                  Products Management
                </h2>
                <button
                  onClick={() => openModal("product")}
                  className="catrink-button flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Product</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="glass-card p-6">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">{product.image}</div>
                      <h3 className="font-orbitron font-bold text-white">
                        {product.name}
                      </h3>
                      <p className="text-neon-cyan">${product.price}</p>
                    </div>
                    <div className="space-y-2 text-sm text-white/70 mb-4">
                      <p>Energy: {product.energy}</p>
                      <p>Category: {product.category}</p>
                      <p>Flavor: {product.flavor}</p>
                      <p>
                        Rating: {product.rating} ⭐ ({product.reviews} reviews)
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openModal("product", product)}
                        className="flex-1 px-3 py-2 bg-neon-blue/20 text-neon-blue rounded-lg hover:bg-neon-blue/30 transition-colors flex items-center justify-center"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="flex-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center justify-center">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Flavors section */}
          {activeSection === "flavors" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-orbitron font-bold text-2xl text-white">
                  Flavors Management
                </h2>
                <button
                  onClick={() => openModal("flavor")}
                  className="catrink-button flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Flavor</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {flavors.map((flavor) => (
                  <div key={flavor.id} className="glass-card p-6">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">{flavor.image}</div>
                      <h3 className="font-orbitron font-bold text-white">
                        {flavor.name}
                      </h3>
                      <p className="text-neon-purple text-sm">
                        {flavor.tagline}
                      </p>
                      <p className="text-neon-cyan">${flavor.price}</p>
                    </div>
                    <div className="space-y-2 text-sm text-white/70 mb-4">
                      <p>Energy: {flavor.energyLevel}</p>
                      <p>Featured: {flavor.featured ? "Yes" : "No"}</p>
                      <p>
                        Ingredients: {flavor.ingredients.slice(0, 3).join(", ")}
                      </p>
                      <p>
                        Rating: {flavor.rating} ⭐ ({flavor.reviews} reviews)
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openModal("flavor", flavor)}
                        className="flex-1 px-3 py-2 bg-neon-purple/20 text-neon-purple rounded-lg hover:bg-neon-purple/30 transition-colors flex items-center justify-center"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="flex-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center justify-center">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coupons section */}
          {activeSection === "coupons" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-orbitron font-bold text-2xl text-white">
                  Coupons Management
                </h2>
                <button
                  onClick={() => openModal("coupon")}
                  className="catrink-button flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Coupon</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {coupons.map((coupon) => (
                  <div key={coupon.id} className="glass-card p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-orbitron font-bold text-xl text-white">
                          {coupon.code}
                        </h3>
                        <p className="text-neon-purple">
                          {coupon.type === "percentage"
                            ? `${coupon.discount}% off`
                            : `$${coupon.discount} off`}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-semibold",
                          coupon.active
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400",
                        )}
                      >
                        {coupon.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-white/70 mb-4">
                      <p>Min Order: ${coupon.minOrder}</p>
                      <p>
                        Uses: {coupon.currentUses}/{coupon.maxUses}
                      </p>
                      <p>Expires: {coupon.expiryDate}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openModal("coupon", coupon)}
                        className="flex-1 px-3 py-2 bg-neon-cyan/20 text-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors flex items-center justify-center"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="flex-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center justify-center">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-orbitron font-bold text-xl text-white">
                  {editingItem ? `Edit ${modalType}` : `Add ${modalType}`}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Product Form */}
              {modalType === "product" && (
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div>
                    <label className="block text-white font-orbitron mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) =>
                        setProductForm({ ...productForm, name: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-neon-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-orbitron mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          price: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-neon-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-orbitron mb-2">
                      Image (emoji)
                    </label>
                    <input
                      type="text"
                      value={productForm.image}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          image: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-neon-blue"
                      placeholder="🥭"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-orbitron mb-2">
                      Description
                    </label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-neon-blue"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-4 py-2 border-2 border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-lg hover:scale-105 transition-transform"
                    >
                      {editingItem ? "Update" : "Add"} Product
                    </button>
                  </div>
                </form>
              )}

              {/* Coupon Form */}
              {modalType === "coupon" && (
                <form onSubmit={handleCouponSubmit} className="space-y-4">
                  <div>
                    <label className="block text-white font-orbitron mb-2">
                      Coupon Code
                    </label>
                    <input
                      type="text"
                      value={couponForm.code}
                      onChange={(e) =>
                        setCouponForm({
                          ...couponForm,
                          code: e.target.value.toUpperCase(),
                        })
                      }
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-neon-blue"
                      placeholder="SAVE20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-orbitron mb-2">
                      Discount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={couponForm.discount}
                      onChange={(e) =>
                        setCouponForm({
                          ...couponForm,
                          discount: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-neon-blue"
                      placeholder="20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-orbitron mb-2">
                      Type
                    </label>
                    <select
                      value={couponForm.type}
                      onChange={(e) =>
                        setCouponForm({
                          ...couponForm,
                          type: e.target.value as "percentage" | "fixed",
                        })
                      }
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-neon-blue"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white font-orbitron mb-2">
                      Min Order Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={couponForm.minOrder}
                      onChange={(e) =>
                        setCouponForm({
                          ...couponForm,
                          minOrder: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-neon-blue"
                      placeholder="10.00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-orbitron mb-2">
                      Max Uses
                    </label>
                    <input
                      type="number"
                      value={couponForm.maxUses}
                      onChange={(e) =>
                        setCouponForm({
                          ...couponForm,
                          maxUses: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-neon-blue"
                      placeholder="100"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-orbitron mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={couponForm.expiryDate}
                      onChange={(e) =>
                        setCouponForm({
                          ...couponForm,
                          expiryDate: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-neon-blue"
                      required
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-4 py-2 border-2 border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-purple text-white rounded-lg hover:scale-105 transition-transform"
                    >
                      {editingItem ? "Update" : "Add"} Coupon
                    </button>
                  </div>
                </form>
              )}

              {/* Flavor Form */}
              {modalType === "flavor" && (
                <form onSubmit={handleFlavorSubmit} className="space-y-4">
                  <div>
                    <label className="block text-white font-orbitron mb-2">
                      Flavor Name
                    </label>
                    <input
                      type="text"
                      value={flavorForm.name}
                      onChange={(e) =>
                        setFlavorForm({ ...flavorForm, name: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-neon-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-orbitron mb-2">
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={flavorForm.tagline}
                      onChange={(e) =>
                        setFlavorForm({
                          ...flavorForm,
                          tagline: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-neon-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-orbitron mb-2">
                      Description
                    </label>
                    <textarea
                      value={flavorForm.description}
                      onChange={(e) =>
                        setFlavorForm({
                          ...flavorForm,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-neon-blue"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-4 py-2 border-2 border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-neon-purple to-neon-red text-white rounded-lg hover:scale-105 transition-transform"
                    >
                      {editingItem ? "Update" : "Add"} Flavor
                    </button>
                  </div>
                </form>
              )}

              {/* User Form */}
              {modalType === "user" && (
                <form onSubmit={handleUserSubmit} className="space-y-4">
                  <div>
                    <label className="block text-white font-orbitron mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={userForm.name}
                      onChange={(e) =>
                        setUserForm({ ...userForm, name: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-neon-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-orbitron mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={userForm.email}
                      onChange={(e) =>
                        setUserForm({ ...userForm, email: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-neon-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-orbitron mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={userForm.phone}
                      onChange={(e) =>
                        setUserForm({ ...userForm, phone: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-neon-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-orbitron mb-2">
                      Status
                    </label>
                    <select
                      value={userForm.status}
                      onChange={(e) =>
                        setUserForm({
                          ...userForm,
                          status: e.target.value as
                            | "active"
                            | "inactive"
                            | "banned",
                        })
                      }
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-neon-blue"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="banned">Banned</option>
                    </select>
                  </div>
                  {!editingItem && (
                    <div>
                      <label className="block text-white font-orbitron mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        value={userForm.password}
                        onChange={(e) =>
                          setUserForm({ ...userForm, password: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-neon-blue"
                        required={!editingItem}
                      />
                    </div>
                  )}
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-4 py-2 border-2 border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-neon-green to-neon-blue text-white rounded-lg hover:scale-105 transition-transform"
                    >
                      {editingItem ? "Update" : "Add"} User
                    </button>
                  </div>
                </form>
              )}

              {/* Order Details */}
              {modalType === "order" && editingItem && (
                <div className="space-y-4">
                  <div className="bg-white/5 p-4 rounded-lg">
                    <h4 className="font-orbitron font-bold text-white mb-2">
                      Order Details
                    </h4>
                    <p className="text-white/70">
                      Order ID: {editingItem.trackingId}
                    </p>
                    <p className="text-white/70">
                      Customer: {editingItem.shippingAddress.fullName}
                    </p>
                    <p className="text-white/70">
                      Total: ${editingItem.totalAmount.toFixed(2)}
                    </p>
                    <p className="text-white/70">
                      Status: {editingItem.status}
                    </p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <h4 className="font-orbitron font-bold text-white mb-2">
                      Items
                    </h4>
                    {editingItem.items.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-white/70"
                      >
                        <span>
                          {item.name} x{item.quantity}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-full px-4 py-2 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-lg hover:scale-105 transition-transform"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
