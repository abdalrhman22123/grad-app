(function () {
  "use strict";

  var AR = {
    "Home": "الرئيسية",
    "Sign in": "تسجيل الدخول",
    "Create account": "إنشاء حساب",
    "Monitors Menu": "قائمة المراقبة",
    "Radio": "الراديو",
    "Bluetooth": "بلوتوث",
    "AR History": "سجل الواقع المعزز",
    "Profile": "الملف الشخصي",
    "Settings": "الإعدادات",
    "Log out": "تسجيل الخروج",
    "Dashboard": "لوحة التحكم",
    "Vehicle Control": "التحكم بالمركبة",
    "Car Insights": "تحليلات السيارة",
    "Car Screen": "شاشة السيارة",
    "Oil Monitor": "مراقبة الزيت",
    "Fuel Monitor": "مراقبة الوقود",
    "Tires Monitor": "مراقبة الإطارات",
    "Engine Health": "صحة المحرك",
    "Ready to have a ride today?": "هل أنت جاهز للقيادة اليوم؟",
    "Welcome back !": "مرحباً بعودتك!",
    "Please enter your details": "يرجى إدخال بياناتك",
    "Email ID": "البريد الإلكتروني",
    "Password": "كلمة المرور",
    "Remember Me": "تذكرني",
    "Forget Password?": "نسيت كلمة المرور؟",
    "Sign In": "تسجيل الدخول",
    "Don't have account": "ليس لديك حساب",
    "Sign up": "إنشاء حساب",
    "Create Account!": "إنشاء حساب!",
    "First name": "الاسم الأول",
    "Surname": "اسم العائلة",
    "Phone number": "رقم الهاتف",
    "Email": "البريد الإلكتروني",
    "Sign Up": "إنشاء حساب",
    "I have account": "لدي حساب",
    "Tire Monitor": "مراقبة الإطارات",
    "Fuel Analytics": "تحليلات الوقود",
    "Vehicle Diagnostics": "تشخيص المركبة",
    "Powertrain Diagnostics": "تشخيص مجموعة الحركة",
    "Engine Status": "حالة المحرك",
    "Needs Service": "يحتاج صيانة",
    "Due Now": "مستحق الآن",
    "Estimated Time": "الوقت المتوقع",
    "Within 3 days": "خلال 3 أيام",
    "Maintenance Alert": "تنبيه صيانة",
    "Book Service Now": "احجز الصيانة الآن",
    "Remind Me Later": "ذكرني لاحقاً",
    "Monitors": "المراقبة",
    "Monitors Menu — OTOVISION": "قائمة المراقبة — OTOVISION",
    "Fuel Monitor — VW Tiguan 2025": "مراقبة الوقود — VW Tiguan 2025",
    "Engine Health — VW Tiguan 2025": "صحة المحرك — VW Tiguan 2025",
    "Tire Monitor — VW Tiguan 2025": "مراقبة الإطارات — VW Tiguan 2025",
    "Oil Monitor — VW Tiguan 2025": "مراقبة الزيت — VW Tiguan 2025",
    "Vehicle Control — VW Tiguan 2025": "التحكم بالمركبة — VW Tiguan 2025",
    "Car Insights — OTOVISION": "تحليلات السيارة — OTOVISION",
    "Settings — OTOVISION": "الإعدادات — OTOVISION",
    "Radio — Tesla Model 3": "الراديو — تسلا موديل 3",
    "Bluetooth — Tesla Model 3": "بلوتوث — تسلا موديل 3",
    "AR Car History — OTOVISION": "سجل السيارة بالواقع المعزز — OTOVISION",
    "OTOVISION — Home": "OTOVISION — الرئيسية",
    "OTOVISION — Create Account": "OTOVISION — إنشاء حساب",
    "OTOVISION Login": "تسجيل دخول OTOVISION",
    "Skip to content": "تخطي إلى المحتوى",
    "Theme": "المظهر",
    "Dark Mode": "الوضع الداكن",
    "Light Mode": "الوضع الفاتح",
    "Auto": "تلقائي",
    "Notifications": "الإشعارات",
    "System": "النظام"
  };

  function translateAttributes(root) {
    var attrList = ["placeholder", "title", "aria-label"];
    var nodes = root.querySelectorAll("*");
    for (var i = 0; i < nodes.length; i++) {
      for (var a = 0; a < attrList.length; a++) {
        var attr = attrList[a];
        var value = nodes[i].getAttribute(attr);
        if (value && AR[value]) nodes[i].setAttribute(attr, AR[value]);
      }
    }
  }

  function translateTextNodes(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var node;
    while ((node = walker.nextNode())) {
      var parent = node.parentNode;
      if (!parent) continue;
      var tag = parent.nodeName;
      if (tag === "SCRIPT" || tag === "STYLE") continue;
      var raw = node.nodeValue;
      var trimmed = raw.trim();
      if (!trimmed) continue;
      var replacement = AR[trimmed];
      if (replacement) node.nodeValue = raw.replace(trimmed, replacement);
    }
  }

  window.applyArabicTranslations = function () {
    if (AR[document.title]) document.title = AR[document.title];
    translateTextNodes(document.body);
    translateAttributes(document.body);
  };
})();
