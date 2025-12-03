SELECT slug, business_name, custom_domain, is_active 
FROM merchants 
WHERE custom_domain IS NOT NULL;
