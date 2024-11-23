FROM nginx:latest

# Remove the default Nginx configuration file
RUN rm /etc/nginx/nginx.conf

# Copy the custom Nginx configuration file from the current directory
COPY nginx.conf /etc/nginx/

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]